import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import authMiddleware from '../../Interfaces/http/middleware/auth.js';
import superAdminMiddleware from '../../Interfaces/http/middleware/superAdmin.js';

// Import modul menggunakan file index.js sesuai template
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import lansia from '../../Interfaces/http/api/lansia/index.js';
import pemeriksaan from '../../Interfaces/http/api/pemeriksaan/index.js';
import iot from '../../Interfaces/http/api/iot/index.js';
import dashboard from '../../Interfaces/http/api/dashboard/index.js';
import histori from '../../Interfaces/http/api/histori/index.js';


const createServer = async (container) => {
  // Membaca dokumentasi Swagger dari folder docs/
  // (Pastikan nanti kita membuat folder 'docs' dan file 'swagger.json' di luar src/)
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), 'docs/swagger.json'), 'utf8')
  );

  const app = express();

  // Middleware untuk parsing JSON
  app.use(express.json());

  // Register routes (Mendaftarkan rute dari masing-masing index.js modul)
  // app.use('/users', users(container));
  app.use('/authentications', authentications(container));
  app.use('/iot', iot(container)); // ESP32 bebas mengakses ini
  app.use('/lansia', lansia(container, authMiddleware));
  app.use('/pemeriksaan', pemeriksaan(container, authMiddleware));
  app.use('/dashboard', dashboard(container, authMiddleware));
  app.use('/histori', histori(container, authMiddleware));
  app.use('/users', users(container, authMiddleware, superAdminMiddleware));
  // (Nanti modul lansia, pemeriksaan, dan iot tinggal ditambahkan di sini)

  // Dokumentasi API
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Global error handler
  app.use((error, req, res, next) => {
    const translatedError = DomainErrorTranslator.translate(error);

    // Penanganan client error secara internal (400, 401, 403, 404)
    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }

    // Tampilkan log di terminal untuk membantu proses debug
    console.error(error);

    // Penanganan server error sesuai kebutuhan (500)
    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  // 404 handler jika endpoint tidak ditemukan
  app.use((req, res) => {
    res.status(404).json({
      status: 'fail',
      message: 'Route not found',
    });
  });

  return app;
};

export default createServer;