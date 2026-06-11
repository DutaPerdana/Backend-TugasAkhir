import makeHistoriHandler from './handler.js';
import createHistoriRouter from './routes.js';

export default (container, authMiddleware) => {
  const historiHandler = makeHistoriHandler(container);
  return createHistoriRouter(historiHandler, authMiddleware);
};