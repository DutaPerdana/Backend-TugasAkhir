import ClientError from './ClientError.js';

/**
 * NotFoundError digunakan saat Klien mencari data yang tidak ada di database.
 * Contoh: "Data lansia dengan ID tersebut tidak ditemukan".
 * Menggunakan status 404 (Not Found).
 */
class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;