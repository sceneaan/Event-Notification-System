// import request from 'supertest';
// import app from '../src/app';
// import User from '../src/models/User.model';
// import Event from '../src/models/Event.model';
// import Notification from '../src/models/Notification.model';
// import mongoose from 'mongoose';
// import { describe } from 'node:test';

// describe('Notification System', () => {
//   let user1: any;
//   let user2: any;
  
//   beforeAll(async () => {
//     // Clear existing data
//     await User.deleteMany({});
//     await Event.deleteMany({});
//     await Notification.deleteMany({});
    
//     // Create test users
//     const res1 = await request(app)
//       .post('/api/users')
//       .send({
//         name: 'Joe',
//         email: 'joe@example.com'
//       });
//     user1 = res1.body;
    
//     const res2 = await request(app)
//       .post('/api/users')
//       .send({
//         name: 'Bob',
//         email: 'bob@example.com'
//       });
//     user2 = res2.body;
    
//     // Set user preferences
//     await request(app)
//       .put(`/api/users/${user1._id}/preferences`)
//       .send({
//         preferences: [
//           {
//             eventType: 'task_created',
//             methods: ['email', 'sms']
//           },
//           {
//             eventType: 'task_deleted',
//             methods: ['in-app']
//           }
//         ]
//       });
    
//     await request(app)
//       .put(`/api/users/${user2._id}/preferences`)
//       .send({
//         preferences: [
//           {
//             eventType: 'task_deleted',
//             methods: ['sms']
//           }
//         ]
//       });
//   });
  
//   afterAll(async () => {
//     await mongoose.connection.close();
//   });
  
//   it('should send high-priority notifications immediately', async () => {
//     const eventRes = await request(app)
//       .post('/api/events')
//       .send({
//         type: 'task_created',
//         priority: 'high',
//         data: {
//           title: 'Ticket 123 created',
//           description: 'New ticket created'
//         }
//       });
    
//     expect(eventRes.status).toBe(201);
    
//     // Check notifications for user1
//     const notificationsRes1 = await request(app)
//       .get(`/api/notifications/user/${user1._id}`);
    
//     expect(notificationsRes1.status).toBe(200);
//     expect(notificationsRes1.body.length).toBe(1);
//     expect(notificationsRes1.body[0].methods).toEqual(['email', 'sms']);
    
//     // Check notifications for user2
//     const notificationsRes2 = await request(app)
//       .get(`/api/notifications/user/${user2._id}`);
    
//     expect(notificationsRes2.status).toBe(200);
//     expect(notificationsRes2.body.length).toBe(0);
//   });
  
//   it('should batch low-priority notifications', async () => {
//     const eventRes = await request(app)
//       .post('/api/events')
//       .send({
//         type: 'task_deleted',
//         priority: 'low',
//         data: {
//           title: 'Ticket 123 closed',
//           description: 'Ticket closed'
//         }
//       });
    
//     expect(eventRes.status).toBe(201);
    
//     // Initially, no notifications should be sent
//     const notificationsRes1 = await request(app)
//       .get(`/api/notifications/user/${user1._id}`);
    
//     const taskDeletedNotifications1 = notificationsRes1.body.filter(
//       (n: any) => n.eventId.type === 'task_deleted'
//     );
//     expect(taskDeletedNotifications1.length).toBe(0);
    
//     const notificationsRes2 = await request(app)
//       .get(`/api/notifications/user/${user2._id}`);
    
//     const taskDeletedNotifications2 = notificationsRes2.body.filter(
//       (n: any) => n.eventId.type === 'task_deleted'
//     );
//     expect(taskDeletedNotifications2.length).toBe(0);
    
//     // Manually trigger scheduler (simulating end of day)
//     const pendingNotifications = await Notification.find({
//       sent: false
//     }).populate('eventId');
    
//     expect(pendingNotifications.length).toBe(2);
    
//     // Process pending notifications
//     for (const notification of pendingNotifications) {
//       notification.methods.forEach((method: any) => {
//         console.log(`[TEST] Sending ${method} notification for ${notification.eventId.type}`);
//       });
//       notification.sent = true;
//       await notification.save();
//     }
    
//     // Now notifications should be available
//     const updatedNotificationsRes1 = await request(app)
//       .get(`/api/notifications/user/${user1._id}`);
    
//     const updatedTaskDeletedNotifications1 = updatedNotificationsRes1.body.filter(
//       (n: any) => n.eventId.type === 'task_deleted'
//     );
//     expect(updatedTaskDeletedNotifications1.length).toBe(1);
//     expect(updatedTaskDeletedNotifications1[0].methods).toEqual(['in-app']);
    
//     const updatedNotificationsRes2 = await request(app)
//       .get(`/api/notifications/user/${user2._id}`);
    
//     const updatedTaskDeletedNotifications2 = updatedNotificationsRes2.body.filter(
//       (n: any) => n.eventId.type === 'task_deleted'
//     );
//     expect(updatedTaskDeletedNotifications2.length).toBe(1);
//     expect(updatedTaskDeletedNotifications2[0].methods).toEqual(['sms']);
//   });
  
//   it('should handle bulk notifications', async () => {
//     const bulkRes = await request(app)
//       .post('/api/notifications/bulk')
//       .send({
//         userId: user1._id,
//         notifications: [
//           {
//             eventType: 'task_created',
//             data: {
//               title: 'Bulk Task 1',
//               description: 'First bulk task'
//             }
//           },
//           {
//             eventType: 'task_deleted',
//             data: {
//               title: 'Bulk Task 2',
//               description: 'Second bulk task'
//             }
//           }
//         ]
//       });
    
//     expect(bulkRes.status).toBe(201);
//     expect(bulkRes.body.length).toBe(2);
    
//     // Verify notifications
//     const notificationsRes = await request(app)
//       .get(`/api/notifications/user/${user1._id}`);
    
//     const bulkNotifications = notificationsRes.body.filter(
//       (n: any) => n.eventId.title.includes('Bulk Task')
//     );
//     expect(bulkNotifications.length).toBe(2);
//   });
// });