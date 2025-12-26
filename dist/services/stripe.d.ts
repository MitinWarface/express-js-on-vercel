import Stripe from 'stripe';
export declare const createCheckoutSession: (userId: string, priceId: string) => Promise<Stripe.Response<Stripe.Checkout.Session>>;
export declare const handleWebhook: (payload: Buffer, signature: string) => Promise<void>;
//# sourceMappingURL=stripe.d.ts.map