import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  user_id: mongoose.Types.ObjectId;
  refresh_token: string;
  expires_at: Date;
  created_at: Date;
  ip_address?: string;
  user_agent?: string;
  is_revoked: boolean;
}

const SessionSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  refresh_token: { type: String, required: true }, // Хранится хешированным
  expires_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  ip_address: { type: String }, // Для безопасности
  user_agent: { type: String }, // Для безопасности
  is_revoked: { type: Boolean, default: false },
});

export default mongoose.model<ISession>('Session', SessionSchema);