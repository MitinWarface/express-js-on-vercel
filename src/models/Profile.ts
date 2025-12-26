import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  user_id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  icon?: string;
  settings: any; // Гибкий объект для настроек твиков
  is_preset: boolean;
  created_at: Date;
 updated_at: Date;
}

const ProfileSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  settings: { type: Object, required: true }, // Хранит JSON с настройками
  is_preset: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model<IProfile>('Profile', ProfileSchema);