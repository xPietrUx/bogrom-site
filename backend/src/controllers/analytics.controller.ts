import type { Request, Response } from 'express';
import prisma from '../services/prisma.service';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const sentMessagesCount = await prisma.contactSubmission.count({
            where: { createdAt: { gte: oneMonthAgo } },
        });

        const visitsCount = await prisma.pageVisit.count({
            where: { createdAt: { gte: oneMonthAgo } },
        });

        const activeAnnouncementsCount = await prisma.announcement.count({
            where: { expiresAt: { gt: new Date() } },
        });

        const dailyVisits = await prisma.pageVisit.groupBy({
            by: ['createdAt'],
            where: { createdAt: { gte: oneMonthAgo } },
            _count: {
                id: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        const processedDailyVisits = dailyVisits.map((visit) => ({
            date: visit.createdAt.toISOString().split('T')[0],
            count: visit._count.id,
        }));

        const aggregatedDailyVisits = processedDailyVisits.reduce(
            (acc: Record<string, number>, { date, count }) => {
                acc[date] = (acc[date] || 0) + count;
                return acc;
            },
            {}
        );

        res.json({
            sentMessagesCount,
            visitsCount,
            activeAnnouncementsCount,
            dailyVisits: aggregatedDailyVisits,
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const logVisit = async (req: Request, res: Response) => {
    try {
        await prisma.pageVisit.create({});
        res.status(201).send();
    } catch (error) {
        console.error('Error logging visit:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
