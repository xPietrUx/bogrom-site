import { Router } from 'express';
import * as contactController from '../../controllers/contact.controller';
import { mailLimiter } from '../../middleware/rateLimit.middleware';

const router = Router();

router.post('/', mailLimiter, contactController.handleContactForm);

export default router;
