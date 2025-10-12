import { Router } from 'express';
import * as authController from '../../controllers/auth.controller';
import { checkAuth } from '../../middleware/auth.middleware';
import { loginLimiter } from '../../middleware/rateLimit.middleware';

const router = Router();

// Public routes
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.get('/dashboard', checkAuth, (req, res) => {
    // @ts-ignore
    res.json({ message: `Witaj ${req.user.username}` });
});

export default router;
