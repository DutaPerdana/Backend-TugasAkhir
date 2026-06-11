import express from 'express';

// Menangkap authMiddleware
const createLansiaRouter = (handler, authMiddleware) => {
  const router = express.Router();

  // Sisipkan authMiddleware di tengah, sebelum memanggil handler
  router.post('/', authMiddleware, handler.postLansiaHandler);
  router.get('/', authMiddleware, handler.getLansiaHandler);
  router.put('/:id', authMiddleware, handler.putLansiaHandler);
  router.delete('/:id', authMiddleware, handler.deleteLansiaHandler);

  return router;
};

export default createLansiaRouter;