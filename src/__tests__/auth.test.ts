// backend/src/__tests__/auth.test.ts
import { generateAccessToken, verifyAccessToken } from '../utils/auth';

describe('Authentication Utils', () => {
  const mockUserId = 'test_user_id_123';

  test('should generate and verify access token correctly', () => {
    // Генерируем токен
    const token = generateAccessToken(mockUserId);

    // Проверяем токен
    const decodedUserId = verifyAccessToken(token);

    // Проверяем, что decodedUserId совпадает с mockUserId
    expect(decodedUserId).toBe(mockUserId);
  });

  test('should return null for invalid token', () => {
    const invalidToken = 'invalid.token.here';

    const result = verifyAccessToken(invalidToken);

    expect(result).toBeNull();
 });
});