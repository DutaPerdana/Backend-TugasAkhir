import XLSX from 'xlsx';

export const makeExportExcelUseCase = ({ pemeriksaanRepository }) => {
  return async () => {
    // 1. Ambil data mentah dari database
    const rawData = await pemeriksaanRepository.getAllPemeriksaanForExcel();

    // 2. Mapping ulang nama kolomnya agar cantik dan rapi saat dibuka di Excel Puskesmas
    const formattedData = rawData.map((item, index) => ({
      'No': index + 1,
      'ID Periksa': item.id,
      'Nama Lansia': item.nama_lansia,
      'Jenis Kelamin': item.jenis_kelamin,
      'BB (kg)': item.berat_badan,
      'TB (cm)': item.tinggi_badan,
      'Suhu (°C)': item.suhu,
      'SpO2 (%)': item.spo2,
      'Detak Jantung (bpm)': item.detak_jantung,
      'Tekanan Darah': `${item.sistol}/${item.diastol}`,
      'Kategori Risiko': item.klasifikasi,
      'Tanggal Periksa': new Date(item.created_at).toLocaleDateString('id-ID'),
    }));

    // 3. Proses konversi JSON Array menjadi lembaran Sheet Excel menggunakan package 'xlsx'
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Kesehatan Lansia');

    // 4. Generate file dalam bentuk Buffer (aliran data memori) agar bisa di-download via API
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return excelBuffer;
  };
};