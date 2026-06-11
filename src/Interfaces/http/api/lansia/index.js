import makeLansiaHandler from './handler.js';
import createLansiaRouter from './routes.js';

// Sekarang menerima parameter kedua: authMiddleware
export default (container, authMiddleware) => {
  const lansiaHandler = makeLansiaHandler(container);
  return createLansiaRouter(lansiaHandler, authMiddleware);
};