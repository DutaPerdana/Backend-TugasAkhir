// Lokasi: src/Interfaces/http/api/users/handler.js

const makeUsersHandler = (container) => {

  const postUserHandler = async (req, res, next) => {
    try {
      // Mengambil instance AddUserUseCase dari container kita
      const addUserUseCase = container.getInstance('AddUserUseCase');

      // Eksekusi data dari body
      const addedUser = await addUserUseCase(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          addedUser,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Handler mengambil semua user
  const getUsersHandler = async (req, res, next) => {
    try {
      const getUsersUseCase = container.getInstance('GetUsersUseCase');
      const users = await getUsersUseCase();

      res.status(200).json({ status: 'success', data: { users } });
    } catch (error) {
      next(error);
    }
  };

  // Handler menghapus user
  const deleteUserHandler = async (req, res, next) => {
    try {
      const { id } = req.params; // Ambil ID dari URL parameternya
      const deleteUserUseCase = container.getInstance('DeleteUserUseCase');
      await deleteUserUseCase(id);

      res.status(200).json({ status: 'success', message: 'User berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  };

  return { postUserHandler, getUsersHandler, deleteUserHandler };
};

export default makeUsersHandler;