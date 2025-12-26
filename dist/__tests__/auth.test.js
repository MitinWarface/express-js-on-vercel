"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../utils/auth");
describe('Authentication Utils', () => {
    const mockUserId = 'test_user_id_123';
    test('should generate and verify access token correctly', () => {
        const token = (0, auth_1.generateAccessToken)(mockUserId);
        const decodedUserId = (0, auth_1.verifyAccessToken)(token);
        expect(decodedUserId).toBe(mockUserId);
    });
    test('should return null for invalid token', () => {
        const invalidToken = 'invalid.token.here';
        const result = (0, auth_1.verifyAccessToken)(invalidToken);
        expect(result).toBeNull();
    });
});
//# sourceMappingURL=auth.test.js.map