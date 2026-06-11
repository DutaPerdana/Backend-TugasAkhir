import XLSX from 'xlsx';
import InvariantError from '../../Commons/exceptions/InvariantError.js';

// Kita hapus idGenerator dari parameter objek di bawah ini
export const makeImportLansiaExcelUseCase = ({ lansiaRepository }) => {
  return async (fileBuffer) => {
    try {
      // 1. Ekstrak file buffer kiriman menggunakan bantuan xlsx
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawRows = XLSX.utils.sheet_to_json(worksheet);

      if (rawRows.length === 0) {
        throw new InvariantError('Gagal import. File Excel kosong atau tidak terbaca.');
      }

      // 2. Lakukan mapping fungsional tanpa membuat ID di sini
      const cleanRows = rawRows.map((row) => {
        if (!row['Nama'] || !row['Alamat'] || !row['Tanggal Lahir (YYYY-MM-DD)'] || !row['Jenis Kelamin']) {
          throw new Error('Ada kolom wajib yang kosong pada baris data.');
        }

        return {
          nama: row['Nama'],
          alamat: row['Alamat'],
          tanggal_lahir: row['Tanggal Lahir (YYYY-MM-DD)'],
          jenis_kelamin: row['Jenis Kelamin'],
        };
      });

      // 3. Masukkan ke database (ID akan dibuat otomatis di dalam repository)
      await lansiaRepository.insertBatchLansia(cleanRows);
      return cleanRows.length;

    } catch (error) {
      throw new InvariantError(`Proses import gagal. Pastikan kolom Nama, Alamat, Tanggal Lahir (YYYY-MM-DD), dan Jenis Kelamin terisi dengan benar. (Detail: ${error.message})`);
    }
  };
};