export const makeGetLansiaUseCase = ({ lansiaRepository }) => {
  return async () => {
    // Langsung ambil semua data dari database
    return lansiaRepository.getAllLansia();
  };
};