const makePemeriksaanHandler = (container) => {
  const postPemeriksaanHandler = async (req, res, next) => {
    try {
      const addPemeriksaanUseCase = container.getInstance('AddPemeriksaanUseCase');
      const addedPemeriksaan = await addPemeriksaanUseCase(req.body);

      res.status(201).json({
        status: 'success',
        data: { addedPemeriksaan },
      });
    } catch (error) {
      next(error);
    }
  };

  // Handler baru untuk membatalkan antrean
  const putCancelHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const cancelPemeriksaanUseCase = container.getInstance('CancelPemeriksaanUseCase');
      await cancelPemeriksaanUseCase(id);

      res.status(200).json({
        status: 'success',
        message: 'Antrean pemeriksaan berhasil dibatalkan',
      });
    } catch (error) {
      next(error);
    }
  };

  return { postPemeriksaanHandler, putCancelHandler };
};

export default makePemeriksaanHandler;