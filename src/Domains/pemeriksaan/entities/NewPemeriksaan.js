export const makeNewPemeriksaan = (payload) => {
  const { lansia_id, berat_badan, tinggi_badan } = payload;

  if (!lansia_id || !berat_badan || !tinggi_badan) {
    throw new Error('NEW_PEMERIKSAAN.TIDAK_MEMUAT_PROPERTY_YANG_DIBUTUHKAN');
  }

  if (
    typeof lansia_id !== 'string' ||
    typeof berat_badan !== 'number' ||
    typeof tinggi_badan !== 'number'
  ) {
    throw new Error('NEW_PEMERIKSAAN.TIPE_DATA_TIDAK_SESUAI');
  }

  return Object.freeze({
    lansia_id,
    berat_badan,
    tinggi_badan,
  });
};