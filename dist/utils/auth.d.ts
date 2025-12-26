export declare const generateAccessToken: (userId: string) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyAccessToken: (token: string) => string | null;
export declare const verifyRefreshToken: (token: string) => string | null;
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
export declare const hashRefreshToken: (refreshToken: string) => Promise<string>;
//# sourceMappingURL=auth.d.ts.map