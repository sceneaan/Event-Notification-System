import { Request, Response, NextFunction } from 'express';
import { getUserNotifications, createBulkNotifications } from '../services/notification.service';

export const getUserNotificationsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const notifications = await getUserNotifications(userId);
    res.json(notifications);
  } catch (error: any) {
    next(error);
  }
};

export const createBulkNotificationsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, notifications } = req.body;
    const createdNotifications = await createBulkNotifications(userId, notifications);
    res.status(201).json(createdNotifications);
  } catch (error: any) {
    next(error);
  }
};