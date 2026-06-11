class UserLogin {
  constructor(payload) {
    this._verifyPayload(payload);
    this.username = payload.username;
    this.password = payload.password;
  }

  _verifyPayload({ username, password }) {
    if (!username || !password) {
      throw new Error('USER_LOGIN.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN');
    }
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.TIPE_DATA_TIDAK_SESUAI');
    }
  }
}

export default UserLogin;