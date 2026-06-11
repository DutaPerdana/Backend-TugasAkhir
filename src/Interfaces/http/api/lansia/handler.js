const makeLansiaHandler = (container) => {

  // Handler untuk menambah data lansia
  const postLansiaHandler = async (req, res, next) => {
    try {
      const addLansiaUseCase = container.getInstance('AddLansiaUseCase');
      const addedLansia = await addLansiaUseCase(req.body);

      res.status(201).json({
        status: 'success',
        data: { addedLansia },
      });
    } catch (error) {
      next(error); // Lempar ke Global Error Handler
    }
  };

  // Handler untuk mengambil daftar lansia
  const getLansiaHandler = async (req, res, next) => {
    try {
      const getLansiaUseCase = container.getInstance('GetLansiaUseCase');
      const lansia = await getLansiaUseCase();

      res.status(200).json({
        status: 'success',
        data: { lansia },
      });
    } catch (error) {
      next(error);
    }
  };

  const putLansiaHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const editLansiaUseCase = container.getInstance('EditLansiaUseCase');
      await editLansiaUseCase(id, req.body);

      res.status(200).json({ status: 'success', message: 'Data lansia berhasil diperbarui' });
    } catch (error) {
      next(error);
    }
  };

  const deleteLansiaHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleteLansiaUseCase = container.getInstance('DeleteLansiaUseCase');
      await deleteLansiaUseCase(id);

      res.status(200).json({ status: 'success', message: 'Data lansia berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  };

  return { postLansiaHandler, getLansiaHandler, putLansiaHandler, deleteLansiaHandler };

};

import multer from 'multer';

// Setting multer untuk menangkap file di RAM sementara
const uploadMemory = multer({ storage: multer.memoryStorage() }).single('excel_file');

const makeLansiaExcelHandler = (container) => {

  // Handler untuk DOWNLOAD TEMPLATE EXCEL
  const getTemplateHandler = async (req, res, next) => {
    try {
      const exportLansiaTemplateUseCase = container.getInstance('ExportLansiaTemplateUseCase');
      const buffer = await exportLansiaTemplateUseCase();

      // Set header HTTP khusus agar dikenali sebagai unduhan excel asli
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=Template_Import_Lansia.xlsx');

      res.end(buffer);
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk UPLOAD/IMPORT BIODATA LANSIA
  const postImportExcelHandler = async (req, res, next) => {
    uploadMemory(req, res, async (err) => {
      try {
        if (err) throw new Error('Gagal mengunggah file.');
        if (!req.file) throw new Error('File Excel tidak ditemukan. Gunakan key form-data: excel_file');

        const importLansiaExcelUseCase = container.getInstance('ImportLansiaExcelUseCase');
        const totalImported = await importLansiaExcelUseCase(req.file.buffer);

        res.status(201).json({
          status: 'success',
          message: `Berhasil mengimport data masal! Total ${totalImported} biodata lansia baru berhasil masuk ke database.`,
        });
      } catch (error) {
        next(error);
      }
    });
  };

  return { getTemplateHandler, postImportExcelHandler };
};

// export default makeLansiaHandler;
export { makeLansiaHandler, makeLansiaExcelHandler };