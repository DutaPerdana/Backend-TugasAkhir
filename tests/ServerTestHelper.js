import pool from '../src/Infrastructures/database/postgres/pool.js';

const ServerTestHelper = {
  /**
   * Fungsi untuk menghapus semua data di tabel agar tes selanjutnya bersih.
   * TRUNCATE lebih cepat dari DELETE, dan CASCADE akan menghapus data yang berelasi.
   */
  async cleanTable() {
    await pool.query('TRUNCATE TABLE users, authentications, lansia, pemeriksaan CASCADE');
  },

  /**
   * Menutup koneksi pool setelah semua tes selesai agar terminal tidak hang.
   */
  async closePool() {
    await pool.end();
  }
};

export default ServerTestHelper;