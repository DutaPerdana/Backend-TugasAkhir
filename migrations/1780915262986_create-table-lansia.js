
export const up = (pgm) => {
  pgm.createTable('lansia', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    nama: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    alamat: {
      type: 'TEXT',
      notNull: true,
    },
    tanggal_lahir: {
      type: 'DATE',
      notNull: true,
    },
    jenis_kelamin: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    // Menyimpan kapan data dibuat dan diupdate
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('lansia');
};