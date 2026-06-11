import makeIotHandler from './handler.js';
import createIotRouter from './routes.js';

export default (container) => {
  const iotHandler = makeIotHandler(container);
  return createIotRouter(iotHandler);
};