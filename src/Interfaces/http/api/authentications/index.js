// Lokasi: src/Interfaces/http/api/authentications/index.js
import makeAuthenticationsHandler from './handler.js';
import createAuthenticationsRouter from './routes.js';

export default (container) => {
  // 1. Buat handler dengan menyuntikkan container
  const authenticationsHandler = makeAuthenticationsHandler(container);

  // 2. Pasang handler ke dalam router dan kembalikan
  return createAuthenticationsRouter(authenticationsHandler);
};