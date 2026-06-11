/**
 * Fungsi 'up' dijalankan saat kita melakukan migrasi (membuat tabel)
 */
export const up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    role: {
      type: 'VARCHAR(20)',
      notNull: true,
      default: 'user', // Default role adalah user biasa
    },
  });
};

/**
 * Fungsi 'down' dijalankan jika kita ingin membatalkan (rollback/menghapus) tabel
 */
export const down = (pgm) => {
  pgm.dropTable('users');
};