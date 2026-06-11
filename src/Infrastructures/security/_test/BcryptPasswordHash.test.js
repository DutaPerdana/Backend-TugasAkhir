import { describe, it, expect, vi } from 'vitest';
import { makeBcryptPasswordHash } from '../BcryptPasswordHash.js';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';

describe('BcryptPasswordHash', () => {
  describe('fungsi hash', () => {
    it('harus mengenkripsi password dengan benar', async () => {
      // Arrange: Siapkan fungsi bcrypt palsu yang mengembalikan teks 'encrypted_password'
      const mockBcrypt = {
        hash: vi.fn().mockResolvedValue('encrypted_password'),
      };
      const bcryptPasswordHash = makeBcryptPasswordHash(mockBcrypt, 10);

      // Action: Panggil fungsi hash kita
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert: Pastikan bcrypt.hash dipanggil dengan nilai yang benar
      expect(mockBcrypt.hash).toHaveBeenCalledWith('plain_password', 10);
      expect(encryptedPassword).toEqual('encrypted_password');
    });
  });

  describe('fungsi comparePassword', () => {
    it('harus melempar AuthenticationError jika password tidak cocok', async () => {
      // Arrange: bcrypt palsu membalas false (password salah)
      const mockBcrypt = {
        compare: vi.fn().mockResolvedValue(false),
      };
      const bcryptPasswordHash = makeBcryptPasswordHash(mockBcrypt);

      // Action & Assert
      await expect(bcryptPasswordHash.comparePassword('plain', 'encrypted'))
        .rejects.toThrowError(AuthenticationError);
    });

    it('tidak boleh melempar error jika password cocok', async () => {
      // Arrange: bcrypt palsu membalas true (password benar)
      const mockBcrypt = {
        compare: vi.fn().mockResolvedValue(true),
      };
      const bcryptPasswordHash = makeBcryptPasswordHash(mockBcrypt);

      // Action & Assert: Tidak boleh ada error yang dilempar
      await expect(bcryptPasswordHash.comparePassword('plain', 'encrypted'))
        .resolves.not.toThrowError(AuthenticationError);
    });
  });
});