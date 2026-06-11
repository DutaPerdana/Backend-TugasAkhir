import UserLogin from '../../Domains/users/entities/UserLogin.js';
import NewAuth from '../../Domains/authentications/entities/NewAuth.js';


class LoginUserUseCase {
  constructor({ userRepository, authenticationRepository, authenticationTokenManager, passwordHash }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    // 1. Validasi Input
    const { username, password } = new UserLogin(useCasePayload);

    // 2. Cek Password di Database
    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);
    await this._passwordHash.comparePassword(password, encryptedPassword);

    // 3. Ambil Data User untuk Token
    const id = await this._userRepository.getIdByUsername(username);
    const role = await this._userRepository.getRoleByUsername(username);

    // 4. Buat dan Simpan Token
    const accessToken = await this._authenticationTokenManager.createAccessToken({ id, username, role });
    await this._authenticationRepository.addToken(accessToken);

    return new NewAuth({ accessToken });
  }
}

export default LoginUserUseCase;