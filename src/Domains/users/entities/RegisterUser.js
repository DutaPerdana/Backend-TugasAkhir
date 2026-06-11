export const makeRegisterUser = (payload) => {
  const { username, password } = payload;

  if (!username || !password) {
    throw new Error('REGISTER_USER.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN');
  }
  if (typeof username !== 'string' || typeof password !== 'string') {
    throw new Error('REGISTER_USER.TIPE_DATA_TIDAK_SESUAI');
  }

  return Object.freeze({
    username,
    password,
    role: 'user', // Default role
  });
};