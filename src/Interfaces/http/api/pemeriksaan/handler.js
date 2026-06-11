

const makePemeriksaanHandler = (container) => {
  const postPemeriksaanHandler = async (req, res, next) => {
    try {
      const addPemeriksaanUseCase = container.getInstance('AddPemeriksaanUseCase');
      const addedPemeriksaan = await addPemeriksaanUseCase(req.body);

      res.status(201).json({
        status: 'success',
        data: { addedPemeriksaan },
      });
    } catch (error) {
      next(error);
    }
  };

  // Handler baru untuk membatalkan antrean
  const putCancelHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const cancelPemeriksaanUseCase = container.getInstance('CancelPemeriksaanUseCase');
      await cancelPemeriksaanUseCase(id);

      res.status(200).json({
        status: 'success',
        message: 'Antrean pemeriksaan berhasil dibatalkan',
      });
    } catch (error) {
      next(error);
    }
  };

  const putProcessHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const processPemeriksaanUseCase = container.getInstance('ProcessPemeriksaanUseCase');
      await processPemeriksaanUseCase(id);

      res.status(200).json({
        status: 'success',
        message: 'Antrean berhasil diproses dan dikirim ke alat ESP32',
      });
    } catch (error) {
      next(error);
    }
  };

  return { postPemeriksaanHandler, putCancelHandler, putProcessHandler };
};

import multer from 'multer';

// Set up konfigurasi penyimpanan sementara multer di memory RAM (bukan harddisk) agar cepat
const uploadMemory = multer({ storage: multer.memoryStorage() }).single('excel_file');

const makeExcelHandler = (container) => {

  // Handler untuk DOWNLOAD EXCEL
  const getExportExcelHandler = async (req, res, next) => {
    try {
      const exportExcelUseCase = container.getInstance('ExportExcelUseCase');
      const buffer = await exportExcelUseCase();

      // PENTING: Set header HTTP agar browser tahu ini adalah file download unduhan Excel asli
      // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=Laporan_Kesehatan_Lansia.xlsx');

      // Kirim data mentah excel
      res.end(buffer);
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk UPLOAD / IMPORT EXCEL
  const postImportExcelHandler = async (req, res, next) => {
    // Kita panggil middleware multer secara manual di dalam handler fungsional
    uploadMemory(req, res, async (err) => {
      try {
        if (err) throw new Error('Gagal memproses upload file.');
        if (!req.file) throw new Error('Silakan sertakan file Excel dengan key form-data: excel_file');

        const importExcelUseCase = container.getInstance('ImportExcelUseCase');

        // Oper file buffer yang ditangkap multer ke Use Case
        const totalImported = await importExcelUseCase(req.file.buffer);

        res.status(201).json({
          status: 'success',
          message: `Berhasil mengimport data masal! Total ${totalImported} data lansia masuk database.`,
        });
      } catch (error) {
        next(error);
      }
    });
  };

  return { getExportExcelHandler, postImportExcelHandler };
};

// export default makePemeriksaanHandler;
export {
  makePemeriksaanHandler,
  makeExcelHandler,
};