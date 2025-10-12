import { Router } from 'express';
import * as analyticsController from '../../controllers/analytics.controller';
import { checkAuth } from '../../middleware/auth.middleware';

const router = Router();

router.post('/log-visit', analyticsController.logVisit);
router.get('/stats', checkAuth, analyticsController.getDashboardStats);

export default router;
