/**
 * Entitas untuk memvalidasi data Lansia baru menggunakan gaya fungsional.
 */
export const makeNewLansia = (payload) => {
  const { nama, alamat, tanggal_lahir, jenis_kelamin } = payload;

  // 1. Pastikan semua kolom terisi
  if (!nama || !alamat || !tanggal_lahir || !jenis_kelamin) {
    throw new Error('NEW_LANSIA.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN');
  }

  // 2. Pastikan tipe datanya benar (String)
  if (
    typeof nama !== 'string' ||
    typeof alamat !== 'string' ||
    typeof tanggal_lahir !== 'string' ||
    typeof jenis_kelamin !== 'string'
  ) {
    throw new Error('NEW_LANSIA.TIPE_DATA_TIDAK_SESUAI');
  }

  // 3. (Opsional) Validasi format tanggal sederhana YYYY-MM-DD dengan regex
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!tanggal_lahir.match(dateRegex)) {
    throw new Error('NEW_LANSIA.FORMAT_TANGGAL_TIDAK_VALID');
  }

  // Mengembalikan objek yang dikunci (immutable) agar aman dari perubahan tak disengaja
  return Object.freeze({
    nama,
    alamat,
    tanggal_lahir,
    jenis_kelamin,
  });
};