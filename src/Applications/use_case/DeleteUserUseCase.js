export const makeDeleteUserUseCase = ({ userRepository }) => {
  return async (userId) => {
    await userRepository.deleteUserById(userId);
    return { status: 'User berhasil dihapus' };
  };
};