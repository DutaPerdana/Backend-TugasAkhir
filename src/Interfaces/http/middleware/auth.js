import jwt from 'jsonwebtoken';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';

const authMiddleware = (req, res, next) => {
  try {
    // 1. Ambil header Authorization
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      throw new AuthenticationError('Akses ditolak. Token tidak ditemukan di header.');
    }

    // 2. Potong kata "Bearer " agar tersisa token JWT murninya saja
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    // 3. Deteksi jika Postman gagal membaca variabel environment
    if (token === '{{accessToken}}') {
      throw new AuthenticationError('Token di Postman belum terisi! Silakan jalankan Request Login dulu agar token tersimpan di Environment.');
    }

    // 4. Verifikasi token menggunakan secret key dari .env
    // Pastikan process.env.ACCESS_TOKEN_KEY di file .env Anda sudah terisi!
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    // 5. Simpan data user ke dalam request agar bisa dipakai oleh endpoint yang dituju
    req.user = decoded;

    next();
  } catch (error) {
    // Jika token cacat (malformed) atau kadaluarsa, lemparkan error 401
    next(new AuthenticationError('Akses ditolak. Token tidak valid atau sudah kadaluarsa.'));
  }
};

export default authMiddleware;


// import jwt from 'jsonwebtoken';
// import config from '../../../Commons/config.js';
// import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';

// /**
//  * Middleware untuk memvalidasi JSON Web Token (JWT).
//  * Layer: Interfaces
//  */
// const authMiddleware = (req, res, next) => {
//   try {
//     // 1. Ambil header Authorization dari request
//     const authHeader = req.header('Authorization');

//     // 2. Jika tidak ada header sama sekali, tolak!
//     if (!authHeader) {
//       throw new AuthenticationError('Akses ditolak. Anda belum login (Token tidak ditemukan).');
//     }

//     // 3. Pisahkan kata 'Bearer' dan isi tokennya (Format: "Bearer eyJhbGciOi...")
//     const token = authHeader.split(' ')[1];
//     if (!token) {
//       throw new AuthenticationError('Format token tidak valid.');
//     }

//     // 4. Verifikasi keaslian token menggunakan kunci rahasia dari .env
//     const decoded = jwt.verify(token, config.auth.accessTokenKey);

//     // 5. Jika lolos, simpan data user (id, username, role) ke dalam object 'req'
//     // agar bisa dipakai oleh handler (misal untuk tahu siapa yang sedang login)
//     req.user = decoded;

//     // 6. Persilakan request melanjutkan perjalanan ke Handler
//     next();
//   // } catch (error) {
//   //   // Jika token kadaluarsa atau palsu
//   //   next(new AuthenticationError('Token tidak valid atau sudah kadaluarsa.'));
//   // }
//   } catch (error) {
//     console.log(error);
//     next(new AuthenticationError(error.message));
//   }
// };

// export default authMiddleware;