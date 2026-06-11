import InvariantError from './InvariantError.js';

/**
 * DomainErrorTranslator
 * Bertugas menerjemahkan Error string dari Layer Domain menjadi Custom Exception (ClientError).
 * Ini menggunakan pendekatan objek/kamus agar sederhana tanpa IF/ELSE yang panjang.
 */
const DomainErrorTranslator = {
  /**
   * Fungsi utama penerjemah.
   * @param {Error} error - Error asli yang ditangkap oleh try/catch
   * @returns {Error} Error baru yang sudah dikenali sebagai ClientError, atau biarkan error asli jika tidak ada di kamus.
   */
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

/**
 * Kamus Data Error (Dictionary).
 * Kiri: Teks error dari Domain.
 * Kanan: Wujud InvariantError yang dilempar ke pengguna/API.
 */
DomainErrorTranslator._directories = {
  // Error dari Modul Register User
  'REGISTER_USER.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN': new InvariantError('Tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.TIPE_DATA_TIDAK_SESUAI': new InvariantError('Tidak dapat membuat user baru karena tipe data tidak sesuai'),

  // Error dari Modul Login
  'USER_LOGIN.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN': new InvariantError('Harus mengirimkan username dan password'),
  'USER_LOGIN.TIPE_DATA_TIDAK_SESUAI': new InvariantError('Username dan password harus berupa string'),

  // Error dari Modul Lansia
  'NEW_LANSIA.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN': new InvariantError('Data lansia tidak lengkap, pastikan nama, alamat, dan tanggal lahir terisi'),
  'NEW_LANSIA.TIPE_DATA_TIDAK_SESUAI': new InvariantError('Tipe data lansia tidak sesuai'),
  'NEW_LANSIA.FORMAT_TANGGAL_TIDAK_VALID': new InvariantError('Format tanggal lahir harus YYYY-MM-DD'),

  // Error dari Modul Pemeriksaan Pending (Antrean)
  'NEW_PENDING.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN': new InvariantError('Harus mengisi Lansia ID, BB, dan TB'),
  'NEW_PENDING.TIPE_DATA_TIDAK_SESUAI': new InvariantError('BB dan TB harus berupa angka'),

  //   Error dari pemeriksaan
  'NEW_PEMERIKSAAN.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN' : new InvariantError('Harus mengisi Lansia ID, BB, dan TB'),
  'NEW_PEMERIKSAAN.TIPE_DATA_TIDAK_SESUAI': new InvariantError('BB dan TB harus berupa angka'),

  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),

  'LOGOUT_USER.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN': new InvariantError('Gagal logout, token tidak ditemukan.'),
  'LOGOUT_USER.TIPE_DATA_TIDAK_SESUAI': new InvariantError('Format token harus berupa string.'),

  // Nanti jika ada tambahan error domain lain, Komandan cukup tambahkan di sini!
};

export default DomainErrorTranslator;