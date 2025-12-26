"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const server = (0, fastify_1.default)({
    logger: true,
});
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://femka304_db_user:LiQmHk08lBywGVqE@cluster0.qyzxhq9.mongodb.net/tweaker?retryWrites=true&w=majority';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));
server.register(user_1.default, { prefix: '/user' });
server.register(auth_1.default, { prefix: '/auth' });
const start = async () => {
    try {
        await server.listen({ port: 300, host: '0.0.0.0' });
        console.log('Server running on http://localhost:3000');
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map