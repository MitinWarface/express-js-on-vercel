import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password_hash: string;
 created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
  is_verified: boolean;
 email_verification_token?: string;
  reset_password_token?: string;
  reset_password_expires_at?: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  last_login_at: { type: Date },
  is_verified: { type: Boolean, default: false },
  email_verification_token: { type: String },
  reset_password_token: { type: String },
  reset_password_expires_at: { type: Date },
});

export default mongoose.model<IUser>('User', UserSchema);