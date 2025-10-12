import type { Request, Response } from 'express';
import { sendContactEmail } from '../services/email.service';
import prisma from '../services/prisma.service';

export const handleContactForm = async (req: Request, res: Response) => {
    const { name, email, phone, subject, message, consent } = req.body;

    if (!name || !email || !phone || !subject || !message || !consent) {
        return res.status(400).json({
            success: false,
            message: 'Wszystkie pola formularza są wymagane',
        });
    }

    try {
        await sendContactEmail(name, email, phone, subject, message);
        await prisma.contactSubmission.create({});
        return res.status(200).json({
            success: true,
            message: 'Wiadomość została pomyślnie wysłana',
        });
    } catch (error) {
        console.error('Błąd podczas wysyłania e-mail: ', error);
        return res.status(500).json({
            success: false,
            message: 'Wystąpił błąd serwera podczas wysyłania wiadomości.',
        });
    }
};
