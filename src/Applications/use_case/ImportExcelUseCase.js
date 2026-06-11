import XLSX from 'xlsx';
import InvariantError from '../../Commons/exceptions/InvariantError.js';

export const makeImportExcelUseCase = ({ pemeriksaanRepository }) => {
  return async (fileBuffer) => {
    try {
      // 1. Baca file buffer kiriman perawat menggunakan ExcelJS/XLSX
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
      const worksheet = workbook.Sheets[sheetName];

      // 2. Ubah data tabel excel menjadi Array Object Javascript biasa
      const rawRows = XLSX.utils.sheet_to_json(worksheet);

      if (rawRows.length === 0) {
        throw new InvariantError('Gagal import. File Excel kosong atau format tidak sesuai.');
      }

      // 3. Bersihkan dan petakan data excel kembali ke nama kolom database asli
      const cleanRows = rawRows.map((row) => ({
        id: row['ID Periksa'] || `periksa-import-${Math.random().toString(36).substr(2, 9)}`,
        lansia_id: row['ID Lansia Wajib'], // Perawat harus mengisi ID Lansia relasi di excel
        berat_badan: parseFloat(row['BB (kg)']),
        tinggi_badan: parseFloat(row['TB (cm)']),
        suhu: parseFloat(row['Suhu (°C)']),
        spo2: parseInt(row['SpO2 (%)']),
        detak_jantung: parseInt(row['Detak Jantung (bpm)']),
        sistol: parseInt(row['Sistol']),
        diastol: parseInt(row['Diastol']),
        kategori_risiko: row['Kategori Risiko AI'] || 'Risiko Rendah'
      }));

      // 4. Hantam massal ke database
      await pemeriksaanRepository.insertBatchPemeriksaan(cleanRows);
      return cleanRows.length; // Mengembalikan jumlah baris yang berhasil diimport
    } catch (error) {
      throw new InvariantError(`Format file Excel rusak atau kolom tidak sesuai. Error: ${error.message}`);
    }
  };
};