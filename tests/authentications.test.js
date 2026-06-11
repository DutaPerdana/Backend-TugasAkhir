import { describe, it, expect, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';
import container from '../src/Infrastructures/container.js';
import ServerTestHelper from './ServerTestHelper.js';

describe('Endpoint Authentications (Login & Logout)', () => {
  // Selalu bersihkan tabel setiap kali satu blok 'it' selesai
  afterEach(async () => {
    await ServerTestHelper.cleanTable();
  });

  // Putus koneksi database di akhir agar terminal tidak nge-hang
  afterAll(async () => {
    await ServerTestHelper.closePool();
  });

  it('POST /authentications - harus merespons 201 dan mengembalikan token saat login sukses', async () => {
    const app = await createServer(container);

    // 1. Arrange: Buat user perawat terlebih dahulu
    await request(app).post('/users').send({
      username: 'perawat_susi',
      password: 'password123',
    });

    // 2. Action: Tembak endpoint Login
    const response = await request(app).post('/authentications').send({
      username: 'perawat_susi',
      password: 'password123',
    });

    // 3. Assert: Pastikan tokennya keluar
    const responseJson = JSON.parse(response.text);
    expect(response.status).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.token).toBeDefined();
    expect(typeof responseJson.data.token).toEqual('string');
  });

  it('DELETE /authentications - harus merespons 200 dan menghapus token jika logout sukses menggunakan Header', async () => {
    const app = await createServer(container);

    // 1. Arrange: Buat akun dan Login untuk mendapatkan token aktif
    await request(app).post('/users').send({ username: 'perawat_susi', password: 'password123' });
    const loginResponse = await request(app).post('/authentications').send({ username: 'perawat_susi', password: 'password123' });

    // Ekstrak token dari hasil login
    const { token } = JSON.parse(loginResponse.text).data;

    // 2. Action: Tembak endpoint Logout dengan menyematkan token di Header
    const response = await request(app)
      .delete('/authentications')
      .set('Authorization', `Bearer ${token}`); // <-- Ini kuncinya!

    // 3. Assert: Pastikan berhasil dihapus
    const responseJson = JSON.parse(response.text);
    expect(response.status).toEqual(200);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.message).toEqual('Logout berhasil, token telah dimusnahkan');
  });

  it('DELETE /authentications - harus merespons 400 jika tidak menyematkan token di Header', async () => {
    const app = await createServer(container);

    // Action: Nekat tembak endpoint Logout tanpa bawa token
    const response = await request(app).delete('/authentications');
    const responseJson = JSON.parse(response.text);

    // Assert: Pastikan sistem menolaknya (menghasilkan Client Error)
    expect(response.status).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
  });
});