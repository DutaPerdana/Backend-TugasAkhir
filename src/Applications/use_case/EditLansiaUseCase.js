import { makeNewLansia } from '../../Domains/lansia/entities/NewLansia.js';

export const makeEditLansiaUseCase = ({ lansiaRepository }) => {
  return async (id, useCasePayload) => {
    // Kita bisa memakai ulang entitas NewLansia untuk memvalidasi input edit (karena strukturnya sama)
    const validLansia = makeNewLansia(useCasePayload);
    await lansiaRepository.editLansiaById(id, validLansia);
  };
};