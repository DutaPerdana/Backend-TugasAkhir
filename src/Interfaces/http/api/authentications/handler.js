// Lokasi: src/Interfaces/http/api/authentications/handler.js

const makeAuthenticationsHandler = (container) => {

  const postAuthenticationHandler = async (req, res, next) => {
    try {
      // 1. Ambil Use Case Login dari kotak perkakas (container)
      const loginUserUseCase = container.getInstance('LoginUserUseCase');

      // 2. Eksekusi Use Case (karena tadi kita buat pakai Class, kita panggil method .execute)
      const { accessToken } = await loginUserUseCase.execute(req.body);

      // 3. Kembalikan response sukses beserta token-nya
      res.status(201).json({
        status: 'success',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      // Lempar error ke Global Error Handler di createServer.js
      next(error);
    }
  };

  // Handler Logout
  // Handler Logout (Otomatis ambil dari Header)
  const deleteAuthenticationHandler = async (req, res, next) => {
    try {
      // 1. Ambil otomatis dari header Authorization
      const authHeader = req.header('Authorization');

      // Jika tidak ada header, lempar error
      if (!authHeader) {
        throw new Error('LOGOUT_USER.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN');
      }

      // 2. Pisahkan kata 'Bearer ' untuk mendapatkan token murninya
      const token = authHeader.split(' ')[1];

      // 3. Eksekusi Use Case
      const logoutUserUseCase = container.getInstance('LogoutUserUseCase');
      await logoutUserUseCase({ token });

      res.status(200).json({
        status: 'success',
        message: 'Logout berhasil, token telah dimusnahkan',
      });
    } catch (error) {
      next(error);
    }
  };

  return { postAuthenticationHandler, deleteAuthenticationHandler };
};

export default makeAuthenticationsHandler;