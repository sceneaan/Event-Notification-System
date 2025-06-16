import Event, { IEvent } from '../models/Event.model';
import { createNotificationsForEvent, sendPendingNotifications } from './notification.service';
import { EventType, EventPriority } from '../types/common';

export interface CreateEventInput {
  type: EventType;
  priority: EventPriority;
  data: {
    title: string;
    description: string;
  };
}

export const createEvent = async (eventData: CreateEventInput): Promise<IEvent> => {
  try {
    const event = new Event(eventData);
    const savedEvent = await event.save();
    console.log(`[Event] Created event id: ${savedEvent._id}`);
    console.log(`[Event] Created event title: ${savedEvent.data.title}`);
    
    // Create notifications for this event
    const notifications = await createNotificationsForEvent(savedEvent);
    console.log(`Created ${notifications.length} notifications for event`);
    
    // Immediately send high-priority notifications
    if (eventData.priority === 'high') {
      console.log('Sending immediate notifications for high-priority event');
      
      await sendPendingNotifications(notifications);
    }
    
    return savedEvent;
  } catch (error) {
    console.error('[Event] Error creating event:', error);
    throw error;
  }
};

export const findEventById = async (eventId: string) => {
  return Event.findById(eventId);
};

export const getEvents = async () => {
  return Event.find().sort({ createdAt: -1 });
};