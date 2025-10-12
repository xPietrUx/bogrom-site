import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        console.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            message: `Zbyt wiele prób logowania. Spróbuj ponownie później.`,
        });
    },
});

export const mailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        const datePlusOneHour = new Date();
        const date = new Date(datePlusOneHour.getTime() + 60 * 60 * 1000);
        console.warn(`Rate limit exceeded for IP: ${req.ip}`);
        const timePL = new Intl.DateTimeFormat('pl-PL', {
            timeZone: 'Europe/Warsaw',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(date);
        res.status(429).json({
            message: `Zbyt wiele wysłanych wiadomości, spróbuj ponownie o ${timePL}`,
        });
    },
});
