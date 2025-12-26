import mongoose, { Document } from 'mongoose';
export interface IProfile extends Document {
    user_id: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    icon?: string;
    settings: any;
    is_preset: boolean;
    created_at: Date;
    updated_at: Date;
}
declare const _default: mongoose.Model<IProfile, {}, {}, {}, mongoose.Document<unknown, {}, IProfile, {}, {}> & IProfile & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Profile.d.ts.map