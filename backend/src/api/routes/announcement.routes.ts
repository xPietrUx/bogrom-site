import { Router } from 'express';
import * as announcementController from '../../controllers/announcement.controller';
import { checkAuth } from '../../middleware/auth.middleware';

const router = Router();

// Trasa publiczna do pobierania aktywnych ogłoszeń
router.get('/active', announcementController.getActiveAnnouncements);

// Trasy chronione dla panelu admina
router.get('/', checkAuth, announcementController.getAllAnnouncements);
router.post('/', checkAuth, announcementController.createAnnouncement);
router.put('/:id', checkAuth, announcementController.updateAnnouncement);
router.delete('/:id', checkAuth, announcementController.deleteAnnouncement);

export default router;
