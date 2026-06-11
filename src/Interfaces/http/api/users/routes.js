import express from 'express';

// Pastikan menerima 3 parameter ini
const createUsersRouter = (handler, authMiddleware, superAdminMiddleware) => {
  const router = express.Router();

  router.post('/', handler.postUserHandler);
  router.get('/', authMiddleware, superAdminMiddleware, handler.getUsersHandler);
  router.delete('/:id', authMiddleware, superAdminMiddleware, handler.deleteUserHandler);

  return router;
};

export default createUsersRouter;