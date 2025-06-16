# Event-Driven Notification System

A robust event-driven notification system that allows users to subscribe to events and receive notifications based on their preferences.

## Features

- User registration and preference management
- Event creation with priority levels (high/low)
- Notification delivery via email, SMS, and in-app
- Batch processing for low-priority notifications
- RESTful API endpoints
- Comprehensive error handling
- Automated scheduling with node-cron

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose ODM)
- **Language**: TypeScript
- **Scheduling**: node-cron
- **Testing**: Jest

## API Documentation

### Endpoints
| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| POST   | /api/users                | Register a new user                  |
| PUT    | /api/users/:id/preferences| Update user preferences              |
| POST   | /api/events               | Create a new event                   |
| POST   | /api/notifications/bulk   | Send bulk notifications              |
| GET    | /api/notifications/user/:id | Get user notifications             |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- TypeScript 5+

### Installation
```bash
# Clone repository
git clone [https://github.com/sceneaan/Event-Notification-System.git]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm start
