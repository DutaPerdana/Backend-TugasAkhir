import config from '../../Commons/config.js';

/**
 * Factory function untuk JSON Web Token Manager.
 * Bertanggung jawab membuat token akses untuk kunci masuk sistem.
 * * @param {Object} jwt - Modul npm jsonwebtoken.
 * @returns {Object} Berisi fungsi createAccessToken.
 */
export const makeJwtTokenManager = (jwt) => {

  /**
   * Membuat Access Token (JWT) yang memiliki batas waktu kadaluarsa.
   * @param {Object} payload - Data yang ingin disisipkan ke dalam token (contoh: { id, role }).
   * @returns {Promise<string>} String JWT yang panjang.
   */
  const createAccessToken = async (payload) => {
    // Menggunakan kunci rahasia dan usia token dari config.js (.env)

    return jwt.sign(payload, config.auth.accessTokenKey, {
      expiresIn: config.auth.accessTokenAge,
    });
  };

  return { createAccessToken };
};