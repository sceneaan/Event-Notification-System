import express from 'express';
import { 
  createEventHandler, 
  getEventsHandler,
  getEventById
} from '../controllers/event.controller';

const router = express.Router();

router.post('/', createEventHandler);
router.get('/', getEventsHandler);
router.get('/:eventId', getEventById);

export default router;