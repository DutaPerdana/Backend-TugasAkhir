const makeDashboardHandler = (container) => {
  const getSummaryHandler = async (req, res, next) => {
    try {
      const getDashboardSummaryUseCase = container.getInstance('GetDashboardSummaryUseCase');
      const summary = await getDashboardSummaryUseCase();

      res.status(200).json({
        status: 'success',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  };

  return { getSummaryHandler };
};

export default makeDashboardHandler;