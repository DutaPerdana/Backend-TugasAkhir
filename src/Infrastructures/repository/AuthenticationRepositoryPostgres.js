import InvariantError from '../../Commons/exceptions/InvariantError.js';

/**
 * Factory function untuk Repository Authentications di PostgreSQL.
 * Layer: Infrastructure
 * Bertugas mengelola data token JWT di database.
 * * @param {Object} pool - Instance koneksi pg pool.
 * @returns {Object} Kumpulan fungsi untuk interaksi tabel authentications.
 */
export const makeAuthenticationRepositoryPostgres = (pool) => {

  /**
   * Menyimpan token baru ke database saat user berhasil login.
   * @param {string} token - Refresh/Access token yang dihasilkan sistem.
   */
  const addToken = async (token) => {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  };

  /**
   * Memeriksa apakah token ada di database.
   * Berguna untuk memastikan token belum dihapus (logout).
   * @param {string} token - Token yang ingin dicek.
   */
  const checkAvailabilityToken = async (token) => {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('Token tidak ditemukan di database (Mungkin sudah logout)');
    }
  };

  /**
   * Menghapus token dari database saat user logout.
   * @param {string} token - Token yang ingin dihapus.
   */
  const deleteToken = async (token) => {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await pool.query(query);
  };

  const checkToken = async (token) => {
    const result = await pool.query({
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    });
    if (result.rowCount === 0) {
      throw new InvariantError('Refresh token tidak ditemukan di database');
    }
  };
  return {
    addToken,
    checkAvailabilityToken,
    deleteToken,
    checkToken,
  };
};