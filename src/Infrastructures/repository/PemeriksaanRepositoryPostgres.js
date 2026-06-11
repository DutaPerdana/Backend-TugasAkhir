import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

export const makePemeriksaanRepositoryPostgres = (pool, idGenerator) => {

  // 1. Fungsi Daftar (Hanya memasukkan ke ruang tunggu)
  const addPemeriksaan = async (newPemeriksaan) => {
    const { lansia_id, berat_badan, tinggi_badan } = newPemeriksaan;
    const id = `periksa-${idGenerator(16)}`;

    const query = {
      text: 'INSERT INTO pemeriksaan (id, lansia_id, berat_badan, tinggi_badan, status) VALUES($1, $2, $3, $4, $5) RETURNING id, lansia_id, status',
      values: [id, lansia_id, berat_badan, tinggi_badan, 'PENDING'], // <--- Berubah jadi PENDING
    };

    const result = await pool.query(query);
    return result.rows[0];
  };

  // 2. Fungsi Baru: Memajukan antrean ke alat ESP32
  const processPemeriksaan = async (id) => {
    // LAPISAN PELINDUNG: Cek apakah masih ada yang statusnya PROCESSING
    const checkQuery = {
      text: 'SELECT id FROM pemeriksaan WHERE status = $1',
      values: ['PROCESSING'],
    };

    const checkResult = await pool.query(checkQuery);
    if (checkResult.rowCount > 0) {
      throw new InvariantError('Gagal memproses. Masih ada lansia yang sedang diperiksa di alat ESP32.');
    }

    // EKSEKUSI UTAMA: Ubah status dari PENDING menjadi PROCESSING
    const updateQuery = {
      text: "UPDATE pemeriksaan SET status = 'PROCESSING' WHERE id = $1 AND status = 'PENDING' RETURNING id",
      values: [id],
    };

    const updateResult = await pool.query(updateQuery);
    if (updateResult.rowCount === 0) {
      throw new NotFoundError('Gagal memproses. Antrean tidak ditemukan atau statusnya bukan PENDING.');
    }
  };
  /**
   * Mengambil 1 antrean terlama yang statusnya masih 'PROCESSING'.
   * Dipanggil oleh ESP32 untuk mengecek apakah ada pasien.
   */
  const getPendingPemeriksaan = async () => {
    const query = {
      text: "SELECT * FROM pemeriksaan WHERE status = 'PROCESSING' ORDER BY created_at ASC LIMIT 1",
    };
    const result = await pool.query(query);

    // Jika tidak ada antrean, kembalikan null
    if (result.rowCount === 0) return null;
    return result.rows[0];
  };

  /**
   * Menyimpan hasil sensor dari ESP32 dan hasil ML, lalu mengubah status jadi COMPLETED.
   */
  const updateHasilPemeriksaan = async (id, dataSensor, klasifikasi) => {
    const { suhu, spo2, detak_jantung, sistol, diastol } = dataSensor;

    const query = {
      text: `UPDATE pemeriksaan 
             SET suhu = $1, spo2 = $2, detak_jantung = $3, sistol = $4, diastol = $5, klasifikasi = $6, status = $7 
             WHERE id = $8 RETURNING id`,
      values: [suhu, spo2, detak_jantung, sistol, diastol, klasifikasi, 'COMPLETED', id],
    };

    await pool.query(query);
  };

  /**
   * Mengambil seluruh riwayat pemeriksaan yang sudah SELESAI.
   * Menggabungkan data dari tabel pemeriksaan dan tabel lansia.
   */
  const getHistoryPemeriksaan = async () => {
    const query = {
      text: `
        SELECT 
          p.id, 
          l.nama AS nama_lansia, 
          p.berat_badan, p.tinggi_badan, p.suhu, p.spo2, 
          p.detak_jantung, p.sistol, p.diastol, p.klasifikasi, p.created_at
        FROM pemeriksaan p
        JOIN lansia l ON p.lansia_id = l.id
        WHERE p.status = 'COMPLETED'
        ORDER BY p.created_at DESC
      `
    };

    const result = await pool.query(query);
    return result.rows;
  };

  const cancelPemeriksaan = async (id) => {
    const query = {
      text: "UPDATE pemeriksaan SET status = 'CANCELLED' WHERE id = $1 AND status = 'PROCESSING' RETURNING id",
      values: [id],
    };

    const result = await pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Gagal membatalkan. Antrean tidak ditemukan atau sudah tidak berstatus PROCESSING.');
    }
  };

  // Jangan lupa daftarkan getHistoryPemeriksaan di return bawah
  return {
    addPemeriksaan,
    getPendingPemeriksaan,
    updateHasilPemeriksaan,
    getHistoryPemeriksaan,
    cancelPemeriksaan,
    processPemeriksaan,
  };
};