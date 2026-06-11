import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';

/**
 * Middleware untuk memastikan request dilakukan oleh Super Admin.
 * Harus dipasang SETELAH authMiddleware.
 */
const superAdminMiddleware = (req, res, next) => {
  try {
    // req.user diisi oleh authMiddleware sebelumnya
    const { role } = req.user;

    if (role !== 'superadmin') {
      throw new AuthorizationError('Akses ditolak. Anda bukan Super Admin.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default superAdminMiddleware;