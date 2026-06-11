import express from 'express';

const createPemeriksaanRouter = (pemeriksaanHandler, excelHandler, authMiddleware) => {
  const router = express.Router();
  router.post('/', authMiddleware,  pemeriksaanHandler.postPemeriksaanHandler);
  router.put('/:id/cancel', authMiddleware, pemeriksaanHandler.putCancelHandler);
  router.put('/:id/process', authMiddleware, pemeriksaanHandler.putProcessHandler);

  // Daftarkan rute ini ke router Express Anda
  router.get('/export/excel', authMiddleware, excelHandler.getExportExcelHandler);
  router.post('/import/excel', authMiddleware, excelHandler.postImportExcelHandler);
  return router;
};

export default createPemeriksaanRouter;