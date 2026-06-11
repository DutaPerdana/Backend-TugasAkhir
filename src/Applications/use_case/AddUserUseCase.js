import { makeRegisterUser } from '../../Domains/users/entities/RegisterUser.js';

export const makeAddUserUseCase = ({ userRepository, passwordHash }) => {
  return async (useCasePayload) => {
    // 1. Validasi Input
    const registerUser = makeRegisterUser(useCasePayload);

    // 2. Cek Username
    await userRepository.verifyAvailableUsername(registerUser.username);

    // 3. Hash Password
    const hashedPassword = await passwordHash.hash(registerUser.password);

    // 4. Simpan ke Database
    const addedUser = await userRepository.addUser({
      username: registerUser.username,
      password: hashedPassword,
      role: registerUser.role,
    });

    return addedUser;
  };
};