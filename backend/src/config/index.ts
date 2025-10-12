import { TextEncoder } from 'util';

if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
    throw new Error('FATAL ERROR: JWT_ACCESS_TOKEN_SECRET is not defined');
}

export const config = {
    port: process.env.BACKEND_PORT,
    jwt: {
        secret: new TextEncoder().encode(process.env.JWT_ACCESS_TOKEN_SECRET),
        issuer: 'urn:bogrom:issuer',
        audience: 'urn:bogrom:audience',
        expiresIn: '1h',
    },
    cookies: {
        secure: process.env.COOKIE_NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
    },
};
