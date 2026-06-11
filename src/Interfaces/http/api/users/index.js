import makeUsersHandler from './handler.js';
import createUsersRouter from './routes.js';

// Pastikan menerima 3 parameter dari createServer.js
export default (container, authMiddleware, superAdminMiddleware) => {
  const usersHandler = makeUsersHandler(container);

  // Oper ketiga parameternya ke routes
  return createUsersRouter(usersHandler, authMiddleware, superAdminMiddleware);
};