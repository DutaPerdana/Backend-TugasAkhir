export const makeGetHistoryPemeriksaanUseCase = ({ pemeriksaanRepository }) => {
  return async () => {
    // Di sini kita bisa menambahkan logika filter tanggal nanti jika diperlukan,
    // untuk sekarang kita ambil semua data riwayat.
    return pemeriksaanRepository.getHistoryPemeriksaan();
  };
};