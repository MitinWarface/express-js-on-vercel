import mongoose, { Document } from 'mongoose';
export interface ISession extends Document {
    user_id: mongoose.Types.ObjectId;
    refresh_token: string;
    expires_at: Date;
    created_at: Date;
    ip_address?: string;
    user_agent?: string;
    is_revoked: boolean;
}
declare const _default: mongoose.Model<ISession, {}, {}, {}, mongoose.Document<unknown, {}, ISession, {}, {}> & ISession & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Session.d.ts.map