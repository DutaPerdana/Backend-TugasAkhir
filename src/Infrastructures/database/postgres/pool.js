import { Pool } from 'pg';
import 'dotenv/config'; // Otomatis membaca file .env yang sudah kita buat tadi
import config from '../../../Commons/config.js';


// const { Pool } = pg;

/**
 * Konfigurasi Database Pool.
 * Layer: Infrastructure
 * * Kita menggunakan process.env untuk mengambil URL koneksi.
 * Jika kita sedang menjalankan Vitest (NODE_ENV === 'test'),
 * pastikan dia menggunakan database testing agar data asli tidak terhapus.
 */
const pool = new Pool(config.database);

export default pool;