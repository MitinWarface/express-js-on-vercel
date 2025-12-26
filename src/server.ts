import Fastify from 'fastify';
import mongoose from 'mongoose';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';

// Настройка Fastify
const server = Fastify({
  logger: true,
});

// Подключение к MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://femka304_db_user:LiQmHk08lBywGVqE@cluster0.qyzxhq9.mongodb.net/tweaker?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err: any) => console.error('MongoDB connection error:', err));

// Регистрация маршрутов
server.register(userRoutes, { prefix: '/user' });
server.register(authRoutes, { prefix: '/auth' });

// Запуск сервера
const start = async () => {
  try {
    await server.listen({ port: 300, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();