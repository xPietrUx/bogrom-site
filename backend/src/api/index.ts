import { Router } from 'express';
import authRoutes from './routes/auth.routes';
import contactRoutes from './routes/contact.routes';
import announcementRoutes from './routes/announcement.routes';
import analyticsRoutes from './routes/analytics.routes';

const router = Router();

// Public endpoints
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Mounted routes /auth
router.use('/auth', authRoutes);

// Mounted routes /contact
router.use('/contact', contactRoutes);

// Mounted routes /announcements
router.use('/announcements', announcementRoutes);

// Mounted routes /analytics
router.use('/analytics', analyticsRoutes);

export default router;
