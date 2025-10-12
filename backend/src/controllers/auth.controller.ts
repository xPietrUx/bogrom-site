import type { Request, Response } from 'express';
import * as jose from 'jose';
import { config } from '../config';
import bcrypt from 'bcrypt';
import prisma from '../services/prisma.service';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Nazwa użytkownika i hasło są wymagane',
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Nieprawidłowe dane logowania',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Nieprawidłowe dane logowania',
            });
        }

        const token = await new jose.SignJWT({
            id: user.id,
            username: user.username,
            role: user.role,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer(config.jwt.issuer)
            .setAudience(config.jwt.audience)
            .setExpirationTime(config.jwt.expiresIn)
            .sign(config.jwt.secret);

        res.cookie('token', token, {
            httpOnly: true,
            secure: req.protocol === 'https',
            sameSite: 'strict',
            maxAge: config.cookies.maxAge,
            path: '/',
        });

        return res.json({
            success: true,
            message: 'Zalogowano pomyślnie',
        });
    } catch (error) {
        console.error('Login error:', error);
        return res
            .status(500)
            .json({ success: false, message: 'Wystąpił błąd serwera' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.cookie('token', '', { expires: new Date(0), path: '/' });
    return res.json({ success: true, message: 'Wylogowano' });
};
