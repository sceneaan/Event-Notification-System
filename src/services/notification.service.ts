import Notification from '../models/Notification.model';
import { DeliveryMethod } from '../types/common';
import User from '../models/User.model';
import Event, { IEvent } from '../models/Event.model';
import { sendNotification } from '../utils/logger';

export const createNotificationsForEvent = async (event: IEvent) => {
  try {
    console.log(`[Notification] Creating notifications for event: ${event._id}`);
    
    // Find users with preferences for this event type
    const users = await User.find({
      'preferences.eventType': event.type
    });
    
    console.log(`[Notification] Found ${users.length} users for event type: ${event.type}`);
    
    const createdNotifications = [];
    
    for (const user of users) {
      const preference = user.preferences.find(p => p.eventType === event.type);
      if (!preference) {
        console.warn(`No preference found for user ${user._id} and event type ${event.type}`);
        continue;
      }

      console.log(`[Notification] Creating notification for user: ${user._id}`);
      
      // Create notification record
      const notification = new Notification({
        userId: user._id,
        eventId: event._id,
        methods: preference.methods,
        sent: false
      });
      
      const savedNotification = await notification.save();
      createdNotifications.push(savedNotification);
    }
    
    console.log(`[Notification] Created ${createdNotifications.length} notifications`);
    return createdNotifications;
  } catch (error) {
    console.error('[Notification] Error creating notifications:', error);
    return [];
  }
};

export const sendPendingNotifications = async (notifications: any[]) => {
  console.log(`[Notification] Sending ${notifications.length} pending notifications`);
  
  for (const notification of notifications) {
    try {
      console.log(`Processing notification: ${notification._id}`);
      
      // Skip if already sent
      if (notification.sent) {
        console.log(`Notification ${notification._id} already sent, skipping`);
        continue;
      }
      
      // Get user and event details
      const user = await User.findById(notification.userId);
      const event = await Event.findById(notification.eventId);
      
      if (!user || !event) {
        console.warn(`Skipping notification ${notification._id} - missing user or event data`);
        continue;
      }
      
      console.log(`Sending notification to ${user.email} for event: ${event.data.title}`);
      
      // Send for each delivery method
      for (const method of notification.methods) {
        console.log(`Sending via ${method.toUpperCase()}`);
        sendNotification(user, event, method as DeliveryMethod);
      }
      
      // Update notification status
      notification.sent = true;
      await notification.save();
      console.log(`Notification ${notification._id} sent successfully`);
      
    } catch (error) {
      console.error(`Failed to send notification ${notification._id}:`, error);
    }
  }
};

export const getUserNotifications = async (userId: string) => {
  return Notification.find({ userId })
    .populate('eventId')
    .sort({ createdAt: -1 });
};

export interface BulkNotificationInput {
  eventType: string;
  data: {
    title: string;
    description: string;
  };
}

export const createBulkNotifications = async (
  userId: string,
  notificationsData: BulkNotificationInput[]
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const notificationPromises = notificationsData.map(async (data) => {
    const preference = user.preferences.find(p => p.eventType === data.eventType);
    if (!preference) return null;

    const event = await Event.create({
      type: data.eventType,
      priority: 'high',
      data: data.data
    });

    const notification = await Notification.create({
      userId: user._id,
      eventId: event._id,
      methods: preference.methods,
      sent: true // Send immediately
    });

    for (const method of preference.methods) {
      sendNotification(user, event, method);
    }

    return notification;
  });

  return (await Promise.all(notificationPromises)).filter(Boolean);
};