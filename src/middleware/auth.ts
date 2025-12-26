import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { verifyAccessToken } from '../utils/auth';
import User from '../models/User';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Токен отсутствует или имеет неверный формат.' });
  }

  const token = authHeader.substring(7); // Убираем 'Bearer '
  const userId = verifyAccessToken(token);

  if (!userId) {
    return reply.code(401).send({ message: 'Неверный или просроченный токен.' });
  }

  // Добавляем информацию о пользователе в объект запроса
  const user = await User.findById(userId);
  if (!user) {
    return reply.code(401).send({ message: 'Пользователь не найден.' });
  }

  (request as any).user = user; // Привязываем пользователя к запросу
  done();
};