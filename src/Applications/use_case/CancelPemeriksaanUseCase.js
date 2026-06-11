export const makeCancelPemeriksaanUseCase = ({ pemeriksaanRepository }) => {
  return async (id) => {
    await pemeriksaanRepository.cancelPemeriksaan(id);
  };
};