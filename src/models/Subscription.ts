import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
 user_id: mongoose.Types.ObjectId;
  stripe_customer_id?: string;
 stripe_subscription_id?: string;
  plan_type: string; // 'basic', 'premium'
  status: string; // 'active', 'canceled', 'past_due', 'unpaid'
  current_period_start?: Date;
  current_period_end?: Date;
  cancel_at_period_end: boolean;
  created_at: Date;
  updated_at: Date;
}

const SubscriptionSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stripe_customer_id: { type: String, unique: true },
  stripe_subscription_id: { type: String, unique: true },
  plan_type: { type: String, required: true, default: 'basic' },
  status: { type: String, required: true, default: 'active' },
  current_period_start: { type: Date },
  current_period_end: { type: Date },
  cancel_at_period_end: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);