// import { describe, it, expect, vi } from 'vitest';
// import { makeJwtTokenManager } from '../JwtTokenManager.js';

// describe('JwtTokenManager', () => {
//   describe('fungsi createAccessToken', () => {
//     it('harus membuat accessToken dengan benar', async () => {
//       // Arrange: Siapkan payload dan mock jsonwebtoken
//       const payload = { username: 'admin' };
//       const mockJwtToken = {
//         sign: vi.fn().mockReturnValue('mock_token'),
//       };
//       const jwtTokenManager = makeJwtTokenManager(mockJwtToken);

//       // Action
//       const accessToken = await jwtTokenManager.createAccessToken(payload);

//       // Assert
//       expect(mockJwtToken.sign).toHaveBeenCalledWith(payload, expect.any(String), { expiresIn: expect.any(String) });
//       expect(accessToken).toEqual('mock_token');
//     });
//   });
// });