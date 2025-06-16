import cron from 'node-cron';
import Notification from '../models/Notification.model';
import { sendPendingNotifications } from '../services/notification.service';

// Send low-priority notifications per 5 minutes
export const setupNotificationScheduler = () => {
  cron.schedule('* * * * *', async () => { 
    console.log('\n=== Processing low-priority notifications ===');
    
    try {
      const pendingNotifications = await Notification.find({
        sent: false
      })
      .populate('eventId')
      .populate('userId');
      
      console.log(`Found ${pendingNotifications.length} pending notifications`);
      
      if (pendingNotifications.length > 0) {
        console.log(`Sending ${pendingNotifications.length} low-priority notifications`);
        await sendPendingNotifications(pendingNotifications);
      } else {
        console.log('No pending notifications to send');
      }
    } catch (error) {
      console.error('Error processing low-priority notifications:', error);
    }
    
    console.log('=============================================\n');
  });
};