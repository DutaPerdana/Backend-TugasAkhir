import { describe, it, expect, afterEach, afterAll } from 'vitest';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import { makeAuthenticationRepositoryPostgres } from '../AuthenticationRepositoryPostgres.js';
import pool from '../../database/postgres/pool.js';

describe('AuthenticationRepositoryPostgres', () => {
  // Bersihkan tabel setelah setiap test selesai
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  // Tutup pool database setelah semua test di file ini rampung
  afterAll(async () => {
    await pool.end();
  });

  describe('fungsi addToken', () => {
    it('harus menambahkan token ke dalam database', async () => {
      // Arrange
      const authRepository = makeAuthenticationRepositoryPostgres(pool);
      const token = 'token_rahasia_123';

      // Action
      await authRepository.addToken(token);

      // Assert: Pastikan token bisa ditemukan di database dummy
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toEqual(token);
    });
  });

  describe('fungsi checkAvailabilityToken', () => {
    it('harus melempar InvariantError jika token tidak ditemukan', async () => {
      // Arrange
      const authRepository = makeAuthenticationRepositoryPostgres(pool);
      const token = 'token_ngasal';

      // Action & Assert
      await expect(authRepository.checkAvailabilityToken(token))
        .rejects.toThrowError(InvariantError);
    });

    it('tidak boleh melempar error jika token ada di database', async () => {
      // Arrange
      const token = 'token_rahasia_123';
      await AuthenticationsTableTestHelper.addToken(token);
      const authRepository = makeAuthenticationRepositoryPostgres(pool);

      // Action & Assert
      await expect(authRepository.checkAvailabilityToken(token))
        .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('fungsi deleteToken', () => {
    it('harus menghapus token dari database', async () => {
      // Arrange
      const token = 'token_rahasia_123';
      await AuthenticationsTableTestHelper.addToken(token);
      const authRepository = makeAuthenticationRepositoryPostgres(pool);

      // Action
      await authRepository.deleteToken(token);

      // Assert: Pastikan token sudah hilang dari database
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(0);
    });
  });
});