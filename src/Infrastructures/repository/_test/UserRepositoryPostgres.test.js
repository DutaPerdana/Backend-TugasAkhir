import { describe, it, expect, afterEach, afterAll } from 'vitest';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import UserRepositoryPostgres from '../UserRepositoryPostgres.js';
import pool from '../../database/postgres/pool.js';

describe('UserRepositoryPostgres', () => {
  // Membersihkan tabel setelah setiap 1 blok 'it' selesai
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  // Menutup koneksi database setelah semua test di file ini selesai
  afterAll(async () => {
    await pool.end();
  });

  describe('fungsi verifyAvailableUsername', () => {
    it('harus melempar InvariantError jika username tidak tersedia (sudah ada)', async () => {
      // Arrange: Masukkan user ke database dummy
      await UsersTableTestHelper.addUser({ username: 'budi' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert: Pastikan gagal jika daftar dengan nama 'budi' lagi
      await expect(userRepositoryPostgres.verifyAvailableUsername('budi'))
        .rejects.toThrowError(InvariantError);
    });

    it('tidak boleh melempar error jika username tersedia', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('budi'))
        .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('fungsi addUser', () => {
    it('harus menyimpan data user ke database dan mengembalikan ID', async () => {
      // Arrange: Buat pemalsu (mock) untuk fungsi pembuat ID acak (nanoid)
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const registerUser = { username: 'budi', password: 'secret_password', role: 'user' };

      // Action
      const addedUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
      expect(addedUser).toBeDefined();
      expect(addedUser.id).toEqual('user-123');
    });
  });

  describe('fungsi getPasswordByUsername', () => {
    it('harus melempar NotFoundError jika user tidak ditemukan', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
        .rejects.toThrowError(NotFoundError);
    });

    it('harus mengembalikan password dengan benar jika user ada', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding', password: 'secret_password' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      const password = await userRepositoryPostgres.getPasswordByUsername('dicoding');
      expect(password).toEqual('secret_password');
    });
  });
});