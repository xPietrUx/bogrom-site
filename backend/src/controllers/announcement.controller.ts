import type { Request, Response } from 'express';
import prisma from '../services/prisma.service';

export const getAllAnnouncements = async (req: Request, res: Response) => {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({
            message: 'Błąd serwera przy pobieraniu ogłoszeń',
        });
    }
};

export const getActiveAnnouncements = async (req: Request, res: Response) => {
    try {
        const announcements = await prisma.announcement.findMany({
            where: {
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({
            message: 'Błąd serwera przy pobieraniu ogłoszeń',
        });
    }
};

export const createAnnouncement = async (req: Request, res: Response) => {
    const { content, expiresAt } = req.body;
    if (!content || !expiresAt) {
        return res
            .status(400)
            .json({ message: 'Treść i data wygaśnięcia są wymagane' });
    }

    try {
        const announcement = await prisma.announcement.create({
            data: { content, expiresAt: new Date(expiresAt) },
        });
        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({
            message: 'Błąd serwera przy tworzeniu ogłoszenia',
        });
    }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content, expiresAt } = req.body;

    try {
        const announcement = await prisma.announcement.update({
            where: { id: parseInt(id) },
            data: {
                content,
                expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            },
        });
        res.json(announcement);
    } catch (error) {
        res.status(500).json({
            message: 'Błąd serwera przy aktualizacji ogłoszenia',
        });
    }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.announcement.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: 'Błąd serwera przy usuwaniu ogłoszenia',
        });
    }
};
