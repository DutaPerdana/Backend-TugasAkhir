import express from 'express';

const createIotRouter = (handler) => {
  const router = express.Router();
  router.get('/antrean', handler.getAntreanHandler);
  router.post('/result', handler.postHasilSensorHandler);
  return router;
};

export default createIotRouter;