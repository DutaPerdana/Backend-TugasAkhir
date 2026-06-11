import createPemeriksaanRouter from './routes.js';
import {
  makePemeriksaanHandler,
  makeExcelHandler
} from './handler.js';

export default (container, authMiddleware) => {
  const pemeriksaanHandler = makePemeriksaanHandler(container);
  const excelHandler = makeExcelHandler(container);

  return createPemeriksaanRouter(
    pemeriksaanHandler,
    excelHandler,
    authMiddleware
  );
};