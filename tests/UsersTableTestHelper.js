/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

/**
 * Utility pembantu untuk berinteraksi dengan tabel 'users' pada database testing.
 * Hanya digunakan saat proses pengujian (Vitest).
 */
const UsersTableTestHelper = {
  /**
   * Memasukkan data user dummy ke database test.
   */
  async addUser({
    id = 'user-123',
    username = 'petugas1',
    password = 'secret_password',
    role = 'user',
  }) {
    const query = {
      text: 'INSERT INTO users (id, username, password, role) VALUES($1, $2, $3, $4)',
      values: [id, username, password, role],
    };

    await pool.query(query);
  },

  /**
   * Mencari user berdasarkan ID.
   */
  async findUsersById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Membersihkan seluruh isi tabel users (Dijalankan setiap kali selesai test).
   */
  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
    await pool.query('TRUNCATE TABLE users CASCADE');
  },
};

export default UsersTableTestHelper;