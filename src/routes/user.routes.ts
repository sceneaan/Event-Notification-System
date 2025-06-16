import express from 'express';
import {
  registerUser,
  updateUserPreferences,
  getUser,
  getUsers
} from '../controllers/user.controller';

const router = express.Router();

router.post('/', registerUser);
router.get('/', getUsers);
router.put('/:userId/preferences', updateUserPreferences);
router.get('/:userId', getUser);

export default router;