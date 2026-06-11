import makePemeriksaanHandler from './handler.js';
import createPemeriksaanRouter from './routes.js';

export default (container, authMiddleware) => {
  const pemeriksaanHandler = makePemeriksaanHandler(container);
  return createPemeriksaanRouter(pemeriksaanHandler, authMiddleware);
};