import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

export const makeProsesHasilIoTUseCase = ({ pemeriksaanRepository, machineLearningService }) => {
  return async (payloadIoT) => {
    const { pending_id, suhu, spo2, detak_jantung, sistol, diastol } = payloadIoT;

    // 1. Cek apakah antrean dengan ID tersebut benar-benar ada dan masih PROCESSING
    const pendingData = await pemeriksaanRepository.getPendingPemeriksaan();
    if (!pendingData || pendingData.id !== pending_id) {
      throw new NotFoundError('Tidak ada antrean valid yang sedang diproses untuk ID ini');
    }

    // 2. Siapkan data gabungan untuk dikirim ke Machine Learning
    // (Asumsi umur lansia bisa diambil dengan join tabel lansia, tapi untuk sementara kita set default atau perlukan query tambahan)
    // Untuk penyederhanaan saat ini, kita lempar data mentah yang ada
    const dataForML = {
      umur: 65, // Idealnya ini dihitung dari tanggal_lahir lansia via pendingData.lansia_id
      bb: pendingData.berat_badan,
      tb: pendingData.tinggi_badan,
      suhu,
      spo2,
      detak_jantung,
      sistol,
      diastol,
    };

    // 3. Tembak ke Python FastAPI
    const klasifikasi = await machineLearningService.predictRisk(dataForML);

    // 4. Update database dengan hasil lengkap
    await pemeriksaanRepository.updateHasilPemeriksaan(pending_id, payloadIoT, klasifikasi);

    return { status: 'Berhasil diproses', klasifikasi };
  };
};