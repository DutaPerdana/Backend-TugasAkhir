export const makeGetUsersUseCase = ({ userRepository }) => {
  return async () => {
    return userRepository.getAllUsers();
  };
};