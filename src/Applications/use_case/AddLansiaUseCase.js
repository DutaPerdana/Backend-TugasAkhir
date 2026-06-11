import { makeNewLansia } from '../../Domains/lansia/entities/NewLansia.js';

export const makeAddLansiaUseCase = ({ lansiaRepository }) => {
  return async (useCasePayload) => {
    // 1. Validasi input menggunakan entitas
    const newLansia = makeNewLansia(useCasePayload);

    // 2. Simpan ke database via repository
    return lansiaRepository.addLansia(newLansia);
  };
};