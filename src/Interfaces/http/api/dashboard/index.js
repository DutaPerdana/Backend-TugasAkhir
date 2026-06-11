import makeDashboardHandler from './handler.js';
import createDashboardRouter from './routes.js';

export default (container, authMiddleware) => {
  const dashboardHandler = makeDashboardHandler(container);
  return createDashboardRouter(dashboardHandler, authMiddleware);
};