export const makeDeleteLansiaUseCase = ({ lansiaRepository }) => {
  return async (id) => {
    await lansiaRepository.deleteLansiaById(id);
  };
};