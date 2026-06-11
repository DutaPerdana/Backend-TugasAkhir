import express from 'express';

// Menangkap authMiddleware
const createLansiaRouter = (lansiaHandler, excelHandler, authMiddleware) => {
  const router = express.Router();

  // Sisipkan authMiddleware di tengah, sebelum memanggil handler
  router.post('/', authMiddleware, lansiaHandler.postLansiaHandler);
  router.get('/', authMiddleware, lansiaHandler.getLansiaHandler);
  router.put('/:id', authMiddleware, lansiaHandler.putLansiaHandler);
  router.delete('/:id', authMiddleware, lansiaHandler.deleteLansiaHandler);

  router.get('/export/template', authMiddleware, excelHandler.getTemplateHandler);
  router.post('/import/excel', authMiddleware, excelHandler.postImportExcelHandler);

  return router;
};

export default createLansiaRouter;