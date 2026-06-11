import ClientError from './ClientError.js';

/**
 * InvariantError digunakan ketika ada "Aturan Bisnis" yang dilanggar.
 * Contoh: "Umur tidak boleh minus", "Masih ada antrean yang PROCESSING".
 * Menggunakan status 400 (Bad Request).
 */
class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

export default InvariantError;