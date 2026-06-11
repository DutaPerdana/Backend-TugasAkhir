import InvariantError from '../../Commons/exceptions/InvariantError.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

/**
 * Kelas implementasi Repository untuk tabel Users di PostgreSQL.
 * Layer: Infrastructure
 */
class UserRepositoryPostgres {
  /**
   * @param {Object} pool - Koneksi database pg.
   * @param {Function} idGenerator - Fungsi pembuat ID acak (misal: nanoid).
   */
  constructor(pool, idGenerator) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  /**
   * Mengecek apakah username sudah dipakai atau belum.
   * @param {string} username - Nama pengguna yang akan dicek.
   */
  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    // Jika jumlah baris lebih dari 0, berarti username sudah ada
    if (result.rowCount > 0) {
      throw new InvariantError('Username sudah digunakan');
    }
  }

  /**
   * Menyimpan user baru ke dalam database.
   * @param {Object} registerUser - Data user yang sudah divalidasi oleh entitas.
   * @returns {Object} Berisi informasi id, username, dan role.
   */
  async addUser(registerUser) {
    const { username, password, role } = registerUser;
    const id = `user-${this._idGenerator()}`; // Menghasilkan ID unik seperti 'user-XyZ123'

    const query = {
      text: 'INSERT INTO users (id, username, password, role) VALUES($1, $2, $3, $4) RETURNING id, username, role',
      values: [id, username, password, role],
    };

    const result = await this._pool.query(query);

    // Mengembalikan data baris pertama yang berhasil di-insert
    return result.rows[0];
  }

  /**
   * Mengambil password (yang sudah di-hash) berdasarkan username untuk proses login.
   * @param {string} username - Nama pengguna.
   * @returns {string} Password acak.
   */
  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Username tidak ditemukan');
    }

    return result.rows[0].password;
  }

  /**
   * Mengambil ID berdasarkan username.
   */
  async getIdByUsername(username) {
    const query = { text: 'SELECT id FROM users WHERE username = $1', values: [username] };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) throw new NotFoundError('User tidak ditemukan');
    return result.rows[0].id;
  }

  /**
   * Mengambil Role (user/superadmin) berdasarkan username.
   */
  async getRoleByUsername(username) {
    const query = { text: 'SELECT role FROM users WHERE username = $1', values: [username] };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) throw new NotFoundError('User tidak ditemukan');
    return result.rows[0].role;
  }

  /**
   * Mengambil semua daftar user (tanpa password).
   */
  async getAllUsers() {
    const query = {
      text: 'SELECT id, username, role FROM users ORDER BY username ASC',
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  /**
   * Menghapus user berdasarkan ID.
   */
  async deleteUserById(id) {
    const query = {
      text: 'DELETE FROM users WHERE id = $1',
      values: [id],
    };
    await this._pool.query(query);
  }
}

export default UserRepositoryPostgres;