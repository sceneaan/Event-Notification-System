import { Request, Response, NextFunction } from 'express';
import { createEvent, getEvents, findEventById } from '../services/event.service';

export const createEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventData = req.body;
    const event = await createEvent(eventData);
    res.status(201).json(event);
  } catch (error: any) {
    next(error);
  }
};

export const getEventsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (error: any) {
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const event = await findEventById(eventId);
    
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    
    res.json(event);
  } catch (error: any) {
    next(error);
  }
};