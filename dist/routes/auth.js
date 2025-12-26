"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const Session_1 = __importDefault(require("../models/Session"));
const auth_1 = require("../utils/auth");
const authRoutes = async (fastify, options) => {
    fastify.post('/register', async (request, reply) => {
        const { email, password } = request.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return reply.code(400).send({ message: 'Пользователь с таким email уже существует.' });
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newUser = new User_1.default({
            email,
            password_hash: hashedPassword,
        });
        await newUser.save();
        const accessToken = (0, auth_1.generateAccessToken)(newUser._id.toString());
        const refreshToken = (0, auth_1.generateRefreshToken)(newUser._id.toString());
        const hashedRefreshToken = await (0, auth_1.hashRefreshToken)(refreshToken);
        const newSession = new Session_1.default({
            user_id: newUser._id,
            refresh_token: hashedRefreshToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 1000)
        });
        await newSession.save();
        reply.send({
            message: 'Пользователь успешно зарегистрирован.',
            user: {
                id: newUser._id,
                email: newUser.email,
            },
            tokens: {
                access_token: accessToken,
                refresh_token: refreshToken,
            },
        });
    });
    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return reply.code(401).send({ message: 'Неверный email или пароль.' });
        }
        const isPasswordValid = await (0, auth_1.comparePassword)(password, user.password_hash);
        if (!isPasswordValid) {
            return reply.code(401).send({ message: 'Неверный email или пароль.' });
        }
        user.last_login_at = new Date();
        await user.save();
        const accessToken = (0, auth_1.generateAccessToken)(user._id.toString());
        const refreshToken = (0, auth_1.generateRefreshToken)(user._id.toString());
        const hashedRefreshToken = await (0, auth_1.hashRefreshToken)(refreshToken);
        const newSession = new Session_1.default({
            user_id: user._id,
            refresh_token: hashedRefreshToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 1000)
        });
        await newSession.save();
        reply.send({
            message: 'Успешный вход.',
            user: {
                id: user._id,
                email: user.email,
            },
            tokens: {
                access_token: accessToken,
                refresh_token: refreshToken,
            },
        });
    });
    fastify.post('/refresh', async (request, reply) => {
        const { refresh_token } = request.body;
        if (!refresh_token) {
            return reply.code(401).send({ message: 'Refresh token отсутствует.' });
        }
        const hashedToken = await (0, auth_1.hashRefreshToken)(refresh_token);
        const session = await Session_1.default.findOne({ refresh_token: hashedToken, is_revoked: false });
        if (!session || session.expires_at < new Date()) {
            return reply.code(401).send({ message: 'Неверный или просроченный refresh token.' });
        }
        const userId = (0, auth_1.verifyRefreshToken)(refresh_token);
        if (!userId) {
            return reply.code(401).send({ message: 'Неверный refresh token.' });
        }
        const newAccessToken = (0, auth_1.generateAccessToken)(userId);
        const newRefreshToken = (0, auth_1.generateRefreshToken)(userId);
        const newHashedRefreshToken = await (0, auth_1.hashRefreshToken)(newRefreshToken);
        session.is_revoked = true;
        await session.save();
        const newSession = new Session_1.default({
            user_id: session.user_id,
            refresh_token: newHashedRefreshToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 1000)
        });
        await newSession.save();
        reply.send({
            tokens: {
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
            },
        });
    });
};
exports.default = authRoutes;
//# sourceMappingURL=auth.js.map