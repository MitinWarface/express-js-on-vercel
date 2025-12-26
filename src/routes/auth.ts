import { FastifyPluginAsync } from 'fastify';
import User from '../models/User';
import Session from '../models/Session'; // Импортируем модель Session
import { hashPassword, generateAccessToken, generateRefreshToken, comparePassword, hashRefreshToken, verifyRefreshToken } from '../utils/auth';

const authRoutes: FastifyPluginAsync = async (fastify, options) => {
  // Регистрация
  fastify.post('/register', async (request: any, reply: any) => {
    const { email, password } = request.body as { email: string; password: string };

    // Проверка на существование пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return reply.code(400).send({ message: 'Пользователь с таким email уже существует.' });
    }

    // Хеширование пароля
    const hashedPassword = await hashPassword(password);

    // Создание пользователя
    const newUser = new User({
      email,
      password_hash: hashedPassword,
    });

    await newUser.save();

    // Генерация токенов
    const accessToken = generateAccessToken(newUser._id.toString());
    const refreshToken = generateRefreshToken(newUser._id.toString());
    const hashedRefreshToken = await hashRefreshToken(refreshToken); // Хешируем Refresh-токен

    // Создание сессии с хешем Refresh-токена
    const newSession = new Session({
      user_id: newUser._id,
      refresh_token: hashedRefreshToken, // Сохраняем хеш!
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 1000) // 7 дней
    });
    await newSession.save();

    reply.send({
      message: 'Пользователь успешно зарегистрирован.',
      user: {
        id: newUser._id,
        email: newUser.email,
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
 });

  // Вход
  fastify.post('/login', async (request: any, reply: any) => {
    const { email, password } = request.body as { email: string; password: string };

    const user = await User.findOne({ email });
    if (!user) {
      return reply.code(401).send({ message: 'Неверный email или пароль.' });
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return reply.code(401).send({ message: 'Неверный email или пароль.' });
    }

    // Обновление времени последнего входа
    user.last_login_at = new Date();
    await user.save();

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    const hashedRefreshToken = await hashRefreshToken(refreshToken); // Хешируем Refresh-токен

    // Создание сессии с хешем Refresh-токена
    const newSession = new Session({
      user_id: user._id,
      refresh_token: hashedRefreshToken, // Сохраняем хеш!
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 1000) // 7 дней
    });
    await newSession.save();

    reply.send({
      message: 'Успешный вход.',
      user: {
        id: user._id,
        email: user.email,
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  });

  // Обновление токена
  fastify.post('/refresh', async (request: any, reply: any) => {
    const { refresh_token } = request.body as { refresh_token: string };

    if (!refresh_token) {
      return reply.code(401).send({ message: 'Refresh token отсутствует.' });
    }

    // Находим сессию по хешу Refresh-токена
    const hashedToken = await hashRefreshToken(refresh_token);
    const session = await Session.findOne({ refresh_token: hashedToken, is_revoked: false });

    if (!session || session.expires_at < new Date()) {
      return reply.code(401).send({ message: 'Неверный или просроченный refresh token.' });
    }

    // Проверяем токен
    const userId = verifyRefreshToken(refresh_token);
    if (!userId) {
      return reply.code(401).send({ message: 'Неверный refresh token.' });
    }

    // Генерируем новые токены
    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);
    const newHashedRefreshToken = await hashRefreshToken(newRefreshToken);

    // Обновляем сессию: отмечаем старый токен как отозванный и создаем новую сессию
    session.is_revoked = true;
    await session.save();

    const newSession = new Session({
      user_id: session.user_id,
      refresh_token: newHashedRefreshToken, // Сохраняем хеш нового токена
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 1000) // 7 дней
    });
    await newSession.save();

    reply.send({
      tokens: {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      },
    });
  });
};

export default authRoutes;