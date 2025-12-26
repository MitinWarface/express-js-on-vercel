import { FastifyPluginAsync } from 'fastify';
import { authenticate } from '../middleware/auth';
import Profile from '../models/Profile';
import Subscription from '../models/Subscription';

const userRoutes: FastifyPluginAsync = async (fastify, options) => {
  // Защищенный маршрут для получения информации о пользователе
  fastify.get('/me', { preHandler: authenticate }, async (request: any, reply: any) => {
    // Логика для получения данных пользователя по токену уже в middleware
    const user = (request as any).user;

    // Получаем статус подписки
    const subscription = await Subscription.findOne({ user_id: user._id });

    return {
      id: user._id,
      email: user.email,
      plan: subscription?.plan_type || 'basic', // Возвращаем план из подписки или 'basic'
    };
 });

  // Маршрут для получения профилей пользователя
  fastify.get('/profiles', { preHandler: authenticate }, async (request: any, reply: any) => {
    const user = (request as any).user;
    const profiles = await Profile.find({ user_id: user._id });
    return { profiles };
  });

 // Маршрут для создания профиля
  fastify.post('/profiles', { preHandler: authenticate }, async (request: any, reply: any) => {
    const user = (request as any).user;
    const { name, description, icon, settings } = request.body as { name: string; description?: string; icon?: string; settings: any };

    const newProfile = new Profile({
      user_id: user._id,
      name,
      description,
      icon,
      settings,
    });

    await newProfile.save();
    return { profile: newProfile };
  });

  // Маршрут для получения статуса подписки
  fastify.get('/subscription', { preHandler: authenticate }, async (request: any, reply: any) => {
    const user = (request as any).user;
    const subscription = await Subscription.findOne({ user_id: user._id });

    if (!subscription) {
      return { subscription: null };
    }

    return {
      subscription: {
        id: subscription._id,
        plan_type: subscription.plan_type,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
      },
    };
  });
};

export default userRoutes;