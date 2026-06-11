import ClientError from './ClientError.js';

/**
 * AuthorizationError digunakan ketika User sudah login, tapi tidak punya hak akses.
 * Contoh: "User biasa mencoba menghapus lansia (hanya boleh Superadmin)".
 * Menggunakan status 403 (Forbidden).
 */
class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export default AuthorizationError;