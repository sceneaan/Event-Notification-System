import { Schema, model, Document, Types } from 'mongoose';
import { DeliveryMethod } from '../types/common'; // Import shared enum

export interface INotification extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  methods: DeliveryMethod[];
  sent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required'] 
  },
  eventId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Event', 
    required: [true, 'Event ID is required'] 
  },
  methods: { 
    type: [String], 
    required: [true, 'Delivery methods are required'],
    enum: {
      values: Object.values(DeliveryMethod),
      message: '{VALUE} is not a valid delivery method'
    },
    validate: {
      validator: (methods: DeliveryMethod[]) => methods.length > 0,
      message: 'At least one delivery method must be specified'
    }
  },
  sent: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Prevent duplicate notifications
notificationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// Index for faster querying
notificationSchema.index({ sent: 1 });
notificationSchema.index({ userId: 1 });
notificationSchema.index({ eventId: 1 });

export default model<INotification>('Notification', notificationSchema);