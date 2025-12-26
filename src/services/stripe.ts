import Stripe from 'stripe';
import User from '../models/User';
import Subscription from '../models/Subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here', {
  apiVersion: '2023-10-16', // Установите актуальную версию API
});

// Функция для создания сессии оплаты
export const createCheckoutSession = async (userId: string, priceId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // Используем подписку
      line_items: [
        {
          price: priceId, // ID тарифного плана в Stripe (например, 'price_premium_monthly')
          quantity: 1,
        },
      ],
      customer_email: user.email, // Указываем email пользователя
      success_url: 'http://localhost:5173/success', // URL для перенаправления после успешной оплаты
      cancel_url: 'http://localhost:5173/cancel',   // URL для перенаправления после отмены
      metadata: {
        user_id: userId, // Передаем ID пользователя в метаданных
      },
    });

    return session;
  } catch (error) {
    console.error('Ошибка при создании сессии Stripe Checkout:', error);
    throw error;
  }
};

// Функция для обработки вебхука (заглушка)
export const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'your_stripe_webhook_secret_here';

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: any) {
    console.error(`Ошибка при проверке вебхука: ${err.message}`);
    throw new Error('Ошибка при проверке вебхука');
  }

 // Обработка события
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata?.user_id;

      if (userId) {
        // Обновляем статус подписки в базе данных
        await Subscription.findOneAndUpdate(
          { user_id: userId },
          {
            $set: {
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              plan_type: 'premium', // Пример, можно уточнить логику
              status: 'active',
              current_period_start: new Date((session as any).current_period_start! * 1000),
              current_period_end: new Date((session as any).current_period_end! * 1000),
            },
            $unset: { cancel_at_period_end: 1 }, // Убираем флаг отмены, если был
          },
          { upsert: true } // Создаем запись, если не существует
        );
        console.log(`Статус подписки для пользователя ${userId} обновлен после успешной оплаты.`);
      }
      break;
    // TODO: Добавить другие обработчики (например, customer.subscription.updated, customer.subscription.deleted)
    default:
      console.log(`Необработанное событие: ${event.type}`);
  }
};