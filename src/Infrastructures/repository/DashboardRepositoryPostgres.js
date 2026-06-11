export const makeDashboardRepositoryPostgres = (pool) => {

  const getSummary = async () => {
    // 5 Pekerjaan berat ini dijalankan SERENTAK dalam satu waktu!
    const [
      totalLansiaResult,
      pemeriksaanBulananResult,
      distribusiRisikoResult,
      grafikMingguanResult,
      logAktivitasResult
    ] = await Promise.all([
      // 1. Total Lansia Keseluruhan
      pool.query('SELECT COUNT(*) FROM lansia'),

      // 2. Jumlah Pemeriksaan di Bulan Ini
      pool.query(`
        SELECT COUNT(*) 
        FROM pemeriksaan 
        WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
      `),

      // 3. Distribusi Klasifikasi Risiko (Hanya yang sudah COMPLETED)
      //   pool.query(`
      //     SELECT klasifikasi, COUNT(*) AS jumlah
      //     FROM pemeriksaan
      //     WHERE status = 'COMPLETED' AND klasifikasi IS NOT NULL
      //     GROUP BY klasifikasi
      //   `),
      // 3. Distribusi Klasifikasi Risiko (Hanya membaca 1 status TERBARU per lansia)
      pool.query(`
        WITH PemeriksaanTerbaru AS (
          -- Mengambil 1 baris paling baru (berdasarkan created_at) untuk setiap lansia_id
          SELECT DISTINCT ON (lansia_id) lansia_id, klasifikasi
          FROM pemeriksaan
          WHERE status = 'COMPLETED' AND klasifikasi IS NOT NULL
          ORDER BY lansia_id, created_at DESC
        )
        -- Menggabungkan tabel master lansia dengan hasil pemeriksaan terbarunya
        SELECT 
          COALESCE(pt.klasifikasi, 'Belum Diperiksa') AS klasifikasi, 
          COUNT(l.id) AS jumlah 
        FROM lansia l
        LEFT JOIN PemeriksaanTerbaru pt ON l.id = pt.lansia_id
        GROUP BY COALESCE(pt.klasifikasi, 'Belum Diperiksa')
      `),

      // 4. Grafik Pemeriksaan Mingguan (Mereset tiap awal bulan menggunakan TO_CHAR 'W')
      pool.query(`
        SELECT TO_CHAR(created_at, 'W') AS minggu_ke, COUNT(*) AS jumlah 
        FROM pemeriksaan 
        WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY minggu_ke 
        ORDER BY minggu_ke ASC
      `),

      // 5. Log 5 Aktivitas Pemeriksaan Terbaru (Digabung dengan nama lansia)
      pool.query(`
        SELECT p.id, l.nama, p.status, p.klasifikasi, p.created_at 
        FROM pemeriksaan p
        JOIN lansia l ON p.lansia_id = l.id
        ORDER BY p.created_at DESC
        LIMIT 5
      `)
    ]);

    // Merapikan data Distribusi Risiko agar siap dibaca Frontend
    const distribusiRisiko = distribusiRisikoResult.rows.map((row) => ({
      klasifikasi: row.klasifikasi,
      jumlah: parseInt(row.jumlah, 10)
    }));

    // Merapikan data Grafik Mingguan
    const grafikMingguan = grafikMingguanResult.rows.map((row) => ({
      minggu_ke: parseInt(row.minggu_ke, 10),
      jumlah: parseInt(row.jumlah, 10)
    }));

    return {
      totalLansia: parseInt(totalLansiaResult.rows[0].count, 10),
      pemeriksaanBulanan: parseInt(pemeriksaanBulananResult.rows[0].count, 10),
      distribusiRisiko,
      grafikMingguan,
      logAktivitas: logAktivitasResult.rows
    };
  };

  return { getSummary };
};