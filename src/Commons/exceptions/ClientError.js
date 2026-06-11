/**
 * ClientError adalah induk (base class) untuk semua error yang disebabkan oleh kesalahan User/Klien.
 * Contoh: Data tidak lengkap, token salah, data tidak ditemukan.
 * Status code default-nya adalah 400 (Bad Request).
 */
class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);


    if (this.constructor.name === 'ClientError') {
      throw new Error('cannot instantiate abstract class');
    }

    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

export default ClientError;