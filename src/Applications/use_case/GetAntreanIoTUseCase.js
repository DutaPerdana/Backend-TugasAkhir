export const makeGetAntreanIoTUseCase = ({ pemeriksaanRepository }) => {
  return async () => {
    const antrean = await pemeriksaanRepository.getPendingPemeriksaan();
    return antrean; // Akan mengembalikan null jika kosong
  };
};