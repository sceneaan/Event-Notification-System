import express, { NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/user.routes';
import eventRoutes from './routes/event.routes';
import notificationRoutes from './routes/notification.routes';
import { setupNotificationScheduler } from './utils/scheduler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);

// Setup scheduler for low-priority notifications
// setupNotificationScheduler();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ 
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;