import AuthenticationError from '../../Commons/exceptions/AuthenticationError.js';

/**
 * Factory function untuk Bcrypt Password Hash.
 * Bertanggung jawab mengenkripsi dan mencocokkan password.
 * * @param {Object} bcrypt - Modul npm bcrypt (disuntikkan dari luar).
 * @param {number} saltRound - Tingkat kerumitan enkripsi (biasanya 10).
 * @returns {Object} Berisi fungsi hash dan comparePassword.
 */
export const makeBcryptPasswordHash = (bcrypt, saltRound = 10) => {

  /**
   * Mengubah teks biasa menjadi teks acak rahasia.
   * @param {string} password - Teks password asli.
   */
  const hash = async (password) => {
    return bcrypt.hash(password, saltRound);
  };

  /**
   * Mencocokkan teks biasa dengan teks enkripsi di database.
   * @param {string} plainPassword - Password yang diketik user.
   * @param {string} encryptedPassword - Password acak dari database.
   */
  const comparePassword = async (plainPassword, encryptedPassword) => {
    const result = await bcrypt.compare(plainPassword, encryptedPassword);

    // Jika tidak cocok, langsung lemparkan error 401 ke Global Error Handler
    if (!result) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
  };

  return { hash, comparePassword };
};