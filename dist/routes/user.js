"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middleware/auth");
const Profile_1 = __importDefault(require("../models/Profile"));
const Subscription_1 = __importDefault(require("../models/Subscription"));
const userRoutes = async (fastify, options) => {
    fastify.get('/me', { preHandler: auth_1.authenticate }, async (request, reply) => {
        const user = request.user;
        const subscription = await Subscription_1.default.findOne({ user_id: user._id });
        return {
            id: user._id,
            email: user.email,
            plan: subscription?.plan_type || 'basic',
        };
    });
    fastify.get('/profiles', { preHandler: auth_1.authenticate }, async (request, reply) => {
        const user = request.user;
        const profiles = await Profile_1.default.find({ user_id: user._id });
        return { profiles };
    });
    fastify.post('/profiles', { preHandler: auth_1.authenticate }, async (request, reply) => {
        const user = request.user;
        const { name, description, icon, settings } = request.body;
        const newProfile = new Profile_1.default({
            user_id: user._id,
            name,
            description,
            icon,
            settings,
        });
        await newProfile.save();
        return { profile: newProfile };
    });
    fastify.get('/subscription', { preHandler: auth_1.authenticate }, async (request, reply) => {
        const user = request.user;
        const subscription = await Subscription_1.default.findOne({ user_id: user._id });
        if (!subscription) {
            return { subscription: null };
        }
        return {
            subscription: {
                id: subscription._id,
                plan_type: subscription.plan_type,
                status: subscription.status,
                current_period_start: subscription.current_period_start,
                current_period_end: subscription.current_period_end,
                cancel_at_period_end: subscription.cancel_at_period_end,
            },
        };
    });
};
exports.default = userRoutes;
//# sourceMappingURL=user.js.map