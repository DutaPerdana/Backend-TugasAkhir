const makeIotHandler = (container) => {

  // Endpoint untuk dicek oleh ESP32 secara berkala (misal tiap 5 detik)
  const getAntreanHandler = async (req, res, next) => {
    try {
      const getAntreanIoTUseCase = container.getInstance('GetAntreanIoTUseCase');
      const antrean = await getAntreanIoTUseCase();

      res.status(200).json({
        status: 'success',
        data: { antrean }, // Jika null, ESP32 tahu sedang tidak ada pasien
      });
    } catch (error) {
      next(error);
    }
  };

  // Endpoint untuk ESP32 mengirim data sensor
  const postHasilSensorHandler = async (req, res, next) => {
    try {
      const prosesHasilIoTUseCase = container.getInstance('ProsesHasilIoTUseCase');
      const hasil = await prosesHasilIoTUseCase(req.body);

      res.status(200).json({
        status: 'success',
        data: hasil,
      });
    } catch (error) {
      next(error);
    }
  };

  return { getAntreanHandler, postHasilSensorHandler };
};

export default makeIotHandler;