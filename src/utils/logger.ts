import { IUser } from '../models/User.model';
import { IEvent } from '../models/Event.model';
import { DeliveryMethod } from '../types/common';

export const sendNotification = (
  user: IUser, 
  event: IEvent, 
  method: DeliveryMethod
): void => {
  try {
    // Simulate notification delivery
    console.log(`\n[${method.toUpperCase()}] NOTIFICATION SENT`);
    console.log(`  Recipient: ${user.name} <${user.email}>`);
    console.log(`  Event: ${event.type} (ID: ${event._id})`);
    console.log(`  Title: ${event.data.title}`);
    console.log(`  Description: ${event.data.description}`);
    console.log('------------------------------------\n');
  } catch (error) {
    console.error('Error in sendNotification:', error);
  }
};