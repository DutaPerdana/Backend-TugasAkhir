export const makeLogoutUserUseCase = ({ authenticationRepository }) => {
  return async (payload) => {
    const { token } = payload; // Langsung ambil token utama yang mau dibuang

    if (!token) {
      throw new Error('LOGOUT_USER.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN');
    }
    if (typeof token !== 'string') {
      throw new Error('LOGOUT_USER.TIPE_DATA_TIDAK_SESUAI');
    }

    // Pastikan tokennya memang ada di tabel authentications, lalu hapus
    await authenticationRepository.checkToken(token);
    await authenticationRepository.deleteToken(token);
  };
};