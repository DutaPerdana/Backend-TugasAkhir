/* istanbul ignore file */
import dotenv from 'dotenv';
import path from 'path';

// Jika sedang menjalankan Vitest, baca file .test.env agar database utama tidak terganggu
if (process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: path.resolve(process.cwd(), '.test.env'),
  });
} else {
  dotenv.config(); // Jika mode biasa (dev/prod), baca file .env
}

/**
 * Pusat konfigurasi aplikasi.
 * Semua variabel dari .env dibaca dan diatur di sini agar tidak berceceran di file lain.
 */
const config = {
  app: {
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: process.env.PORT,
  },
  database: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    // Neon Postgres biasanya butuh SSL di mode production
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  auth: {
    jwtStrategy: 'jwt',
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    // accessTokenAge: process.env.ACCESS_TOKEN_AGE,
    accessTokenAge: Number(process.env.ACCESS_TOKEN_AGE),
  },
};

export default config;