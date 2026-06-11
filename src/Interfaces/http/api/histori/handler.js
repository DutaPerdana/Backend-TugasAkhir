const makeHistoriHandler = (container) => {
  const getHistoriHandler = async (req, res, next) => {
    try {
      const getHistoryPemeriksaanUseCase = container.getInstance('GetHistoryPemeriksaanUseCase');
      const histori = await getHistoryPemeriksaanUseCase();

      res.status(200).json({
        status: 'success',
        data: { histori },
      });
    } catch (error) {
      next(error);
    }
  };

  return { getHistoriHandler };
};

export default makeHistoriHandler;