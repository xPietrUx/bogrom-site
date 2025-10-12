import type { NextFunction, Request, Response } from 'express';
import * as jose from 'jose';
import { config } from '../config';

export const checkAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No authorization: No token' });
    }

    try {
        const { payload } = await jose.jwtVerify(token, config.jwt.secret, {
            issuer: config.jwt.issuer,
            audience: config.jwt.audience,
        });

        // @ts-ignore
        req.user = payload;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: 'Authorization denied: Invalid token' });
    }
};
