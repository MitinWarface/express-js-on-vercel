import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_for_dev';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' }); // 15 минут
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' }); // 7 дней
};

export const verifyAccessToken = (token: string): string | null => {
 try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): string | null => {
 try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
    return decoded.userId;
 } catch (error) {
    return null;
 }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
 return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Новый метод для хеширования Refresh-токена
export const hashRefreshToken = async (refreshToken: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(refreshToken, saltRounds);
};