import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
/**
 * Factory function untuk Repository tabel Lansia.
 * Menghindari class, langsung menggunakan closure fungsi.
 * * @param {Object} pool - Koneksi database
 * @param {Function} idGenerator - Pembuat ID acak (nanoid)
 */
export const makeLansiaRepositoryPostgres = (pool, idGenerator) => {

  /**
   * Menyimpan data lansia baru ke database.
   */
  const addLansia = async (newLansia) => {
    const { nama, alamat, tanggal_lahir, jenis_kelamin } = newLansia;
    const id = `lansia-${idGenerator(16)}`;

    const query = {
      text: 'INSERT INTO lansia (id, nama, alamat, tanggal_lahir, jenis_kelamin) VALUES($1, $2, $3, $4, $5) RETURNING id, nama',
      values: [id, nama, alamat, tanggal_lahir, jenis_kelamin],
    };

    const result = await pool.query(query);
    return result.rows[0];
  };

  /**
   * Mengambil semua data lansia (Untuk ditampilkan di tabel Frontend).
   */
  const getAllLansia = async () => {
    const query = {
      text: 'SELECT id, nama, alamat, tanggal_lahir, jenis_kelamin FROM lansia ORDER BY created_at DESC',
    };

    const result = await pool.query(query);
    return result.rows;
  };

  /**
   * Mengubah data lansia berdasarkan ID.
   */
  const editLansiaById = async (id, updatedLansia) => {
    const { nama, alamat, tanggal_lahir, jenis_kelamin } = updatedLansia;

    const query = {
      text: 'UPDATE lansia SET nama = $1, alamat = $2, tanggal_lahir = $3, jenis_kelamin = $4 WHERE id = $5 RETURNING id',
      values: [nama, alamat, tanggal_lahir, jenis_kelamin, id],
    };

    const result = await pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Gagal memperbarui. ID Lansia tidak ditemukan.');
    }
  };

  /**
   * Menghapus data lansia berdasarkan ID.
   */
  const deleteLansiaById = async (id) => {
    const query = {
      text: 'DELETE FROM lansia WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Gagal menghapus. ID Lansia tidak ditemukan.');
    }
  };

  // Tambahkan fungsi ini di dalam factory makeLansiaRepositoryPostgres Anda

  // Fungsi untuk memasukkan banyak data lansia sekaligus dari Excel
  const insertBatchLansiav2 = async (dataRows) => {
    // Menggunakan perulangan biasa (loop fungsional) untuk eksekusi query satu per satu
    for (const row of dataRows) {
      const query = {
        text: 'INSERT INTO lansia (id, nama, alamat, tanggal_lahir, jenis_kelamin) VALUES ($1, $2, $3, $4, $5)',
        values: [row.id, row.nama, row.alamat, row.tanggal_lahir, row.jenis_kelamin],
      };
      await pool.query(query);
    }
    return true;
  };

  // Fungsi untuk memasukkan banyak data lansia sekaligus dari Excel
  const insertBatchLansia = async (dataRows) => {
    // Menggunakan perulangan biasa (loop fungsional)
    for (const row of dataRows) {

      // INI KUNCINYA: ID dibuat di sini memanfaatkan idGenerator bawaan repository asli
      const id = `lansia-${idGenerator(16)}`;

      const query = {
        text: 'INSERT INTO lansia (id, nama, alamat, tanggal_lahir, jenis_kelamin) VALUES ($1, $2, $3, $4, $5)',
        values: [id, row.nama, row.alamat, row.tanggal_lahir, row.jenis_kelamin],
      };
      await pool.query(query);
    }
    return true;
  };

  // PENTING: Daftarkan 'insertBatchLansia' di dalam blok return paling bawah file ya Wak!
  /**
   * Mengubah status antrean dari PROCESSING menjadi CANCELLED.
   */


  // Jangan lupa daftarkan kedua fungsi baru ini di return
  return {
    addLansia,
    getAllLansia,
    editLansiaById,
    deleteLansiaById,
    insertBatchLansia,
    insertBatchLansiav2,
  };

};