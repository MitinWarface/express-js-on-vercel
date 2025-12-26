"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const auth_1 = require("../utils/auth");
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (request, reply, done) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({ message: 'Токен отсутствует или имеет неверный формат.' });
    }
    const token = authHeader.substring(7);
    const userId = (0, auth_1.verifyAccessToken)(token);
    if (!userId) {
        return reply.code(401).send({ message: 'Неверный или просроченный токен.' });
    }
    const user = await User_1.default.findById(userId);
    if (!user) {
        return reply.code(401).send({ message: 'Пользователь не найден.' });
    }
    request.user = user;
    done();
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map