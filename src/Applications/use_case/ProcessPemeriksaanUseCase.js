export const makeProcessPemeriksaanUseCase = ({ pemeriksaanRepository }) => {
  return async (id) => {
    await pemeriksaanRepository.processPemeriksaan(id);
  };
};