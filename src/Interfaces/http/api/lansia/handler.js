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

export default makeLansiaHandler;