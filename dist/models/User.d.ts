import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map