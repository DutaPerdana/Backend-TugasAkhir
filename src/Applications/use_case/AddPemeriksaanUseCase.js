import { makeNewPemeriksaan } from '../../Domains/pemeriksaan/entities/NewPemeriksaan.js';

export const makeAddPemeriksaanUseCase = ({ pemeriksaanRepository }) => {
  return async (useCasePayload) => {
    // 1. Validasi
    const newPemeriksaan = makeNewPemeriksaan(useCasePayload);

    // 2. Simpan antrean ke database
    return pemeriksaanRepository.addPemeriksaan(newPemeriksaan);
  };
};