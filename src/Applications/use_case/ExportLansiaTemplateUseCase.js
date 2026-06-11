import XLSX from 'xlsx';

export const makeExportLansiaTemplateUseCase = () => {
  return async () => {
    // 1. Definisikan baris contoh agar perawat paham format pengisiannya
    const templateData = [
      {
        'Nama': 'Kakek Sugiono',
        'Alamat': 'Jl. Kemerdekaan No 10, Batu Bara',
        'Tanggal Lahir (YYYY-MM-DD)': '1950-01-01',
        'Jenis Kelamin': 'Laki-laki'
      },
      {
        'Nama': 'Nenek Rohaya',
        'Alamat': 'Kec. Sei Suka, Batu Bara',
        'Tanggal Lahir (YYYY-MM-DD)': '1955-05-12',
        'Jenis Kelamin': 'Perempuan'
      }
    ];

    // 2. Transformasi array data menjadi lembaran kerja (Worksheet) Excel
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Lansia');

    // 3. Konversi menjadi Buffer memori untuk dikirim via HTTP download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return excelBuffer;
  };
};