import express from 'express';

const createPemeriksaanRouter = (handler, authMiddleware) => {
  const router = express.Router();
  router.post('/', authMiddleware,  handler.postPemeriksaanHandler);
  router.put('/:id/cancel', authMiddleware, handler.putCancelHandler);
  return router;
};

export default createPemeriksaanRouter;