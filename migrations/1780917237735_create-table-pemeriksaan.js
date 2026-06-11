

export const up = (pgm) => {
  pgm.createTable('pemeriksaan', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    lansia_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"lansia"', // Berelasi dengan tabel lansia
      onDelete: 'CASCADE',
    },
    berat_badan: {
      type: 'REAL', notNull: true
    }, // Tipe REAL untuk angka desimal (float)
    tinggi_badan: {
      type: 'REAL', notNull: true
    },
    suhu: {
      type: 'REAL'
    }, // Boleh kosong dulu, nanti diisi ESP32
    spo2: {
      type: 'INTEGER'
    },
    detak_jantung: {
      type: 'INTEGER'
    },
    sistol: {
      type: 'INTEGER'
    },
    diastol: {
      type: 'INTEGER'
    },
    status: {
      type: 'VARCHAR(20)',
      notNull: true,
      default: 'PROCESSING' // Status awal saat antrean dibuat
    },
    klasifikasi: {
      type: 'VARCHAR(50)'
    }, // Hasil prediksi dari ML Service
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('pemeriksaan');
};