import express from 'express';

const createDashboardRouter = (handler, authMiddleware) => {
  const router = express.Router();

  // Route dilindungi oleh JWT authMiddleware
  router.get('/', authMiddleware, handler.getSummaryHandler);

  return router;
};

export default createDashboardRouter;