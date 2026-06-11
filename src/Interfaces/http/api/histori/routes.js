import express from 'express';

const createHistoriRouter = (handler, authMiddleware) => {
  const router = express.Router();

  // Route dilindungi, hanya perawat/admin yang sudah login yang bisa melihat
  router.get('/', authMiddleware, handler.getHistoriHandler);

  return router;
};

export default createHistoriRouter;