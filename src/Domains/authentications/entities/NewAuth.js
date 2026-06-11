class NewAuth {
  constructor(payload) {
    this._verifyPayload(payload);
    this.accessToken = payload.accessToken;
  }

  _verifyPayload({ accessToken }) {
    if (!accessToken) {
      throw new Error('NEW_AUTH.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN');
    }
    if (typeof accessToken !== 'string') {
      throw new Error('NEW_AUTH.TIPE_DATA_TIDAK_SESUAI');
    }
  }
}

export default NewAuth;