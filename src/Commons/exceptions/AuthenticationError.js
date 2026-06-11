import ClientError from './ClientError.js';

/**
 * AuthenticationError digunakan saat masalah otentikasi.
 * Contoh: "Password salah", "Token kadaluarsa".
 * Menggunakan status 401 (Unauthorized).
 */
class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export default AuthenticationError;