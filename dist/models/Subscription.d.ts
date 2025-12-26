import mongoose, { Document } from 'mongoose';
export interface ISubscription extends Document {
    user_id: mongoose.Types.ObjectId;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
    plan_type: string;
    status: string;
    current_period_start?: Date;
    current_period_end?: Date;
    cancel_at_period_end: boolean;
    created_at: Date;
    updated_at: Date;
}
declare const _default: mongoose.Model<ISubscription, {}, {}, {}, mongoose.Document<unknown, {}, ISubscription, {}, {}> & ISubscription & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Subscription.d.ts.map