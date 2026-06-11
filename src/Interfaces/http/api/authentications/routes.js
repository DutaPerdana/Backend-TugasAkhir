// Lokasi: src/Interfaces/http/api/authentications/routes.js
import express from 'express';

const createAuthenticationsRouter = (handler) => {
  const router = express.Router();

  // Karena di createServer.js sudah di-prefix dengan '/authentications',
  // di sini kita cukup pakai '/'
  router.post('/', handler.postAuthenticationHandler);
  router.delete('/', handler.deleteAuthenticationHandler);

  return router;
};

export default createAuthenticationsRouter;