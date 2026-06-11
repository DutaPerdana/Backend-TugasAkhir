// import makeLansiaHandler from './handler.js';
import createLansiaRouter from './routes.js';
import { makeLansiaHandler, makeLansiaExcelHandler } from './handler.js';


// Sekarang menerima parameter kedua: authMiddleware
export default (container, authMiddleware) => {
  const lansiaHandler = makeLansiaHandler(container);
  const excelHandler = makeLansiaExcelHandler(container);
  return createLansiaRouter(lansiaHandler, excelHandler, authMiddleware);
};