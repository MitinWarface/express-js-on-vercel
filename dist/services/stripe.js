"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const User_1 = __importDefault(require("../models/User"));
const Subscription_1 = __importDefault(require("../models/Subscription"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here', {
    apiVersion: '2023-10-16',
});
const createCheckoutSession = async (userId, priceId) => {
    try {
        const user = await User_1.default.findById(userId);
        if (!user) {
            throw new Error('Пользователь не найден');
        }
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer_email: user.email,
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cancel',
            metadata: {
                user_id: userId,
            },
        });
        return session;
    }
    catch (error) {
        console.error('Ошибка при создании сессии Stripe Checkout:', error);
        throw error;
    }
};
exports.createCheckoutSession = createCheckoutSession;
const handleWebhook = async (payload, signature) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'your_stripe_webhook_secret_here';
    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    }
    catch (err) {
        console.error(`Ошибка при проверке вебхука: ${err.message}`);
        throw new Error('Ошибка при проверке вебхука');
    }
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const userId = session.metadata?.user_id;
            if (userId) {
                await Subscription_1.default.findOneAndUpdate({ user_id: userId }, {
                    $set: {
                        stripe_customer_id: session.customer,
                        stripe_subscription_id: session.subscription,
                        plan_type: 'premium',
                        status: 'active',
                        current_period_start: new Date(session.current_period_start * 1000),
                        current_period_end: new Date(session.current_period_end * 1000),
                    },
                    $unset: { cancel_at_period_end: 1 },
                }, { upsert: true });
                console.log(`Статус подписки для пользователя ${userId} обновлен после успешной оплаты.`);
            }
            break;
        default:
            console.log(`Необработанное событие: ${event.type}`);
    }
};
exports.handleWebhook = handleWebhook;
//# sourceMappingURL=stripe.js.map