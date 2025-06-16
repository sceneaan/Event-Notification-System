import express from 'express';
import {
  getUserNotificationsHandler,
  createBulkNotificationsHandler
} from '../controllers/notification.controller';

const router = express.Router();

router.get('/user/:userId', getUserNotificationsHandler);
router.post('/bulk', createBulkNotificationsHandler);

export default router;