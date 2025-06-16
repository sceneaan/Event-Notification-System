import { Schema, model, Document, Types } from 'mongoose';
import { EventType, DeliveryMethod } from '../types/common';

export interface NotificationPreference {
  eventType: EventType;
  methods: DeliveryMethod[];
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  preferences: NotificationPreference[];
}

const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    match: [/^\d{10,15}$/, 'Please enter a valid phone number']
  },
  preferences: [{
    eventType: { 
      type: String, 
      required: [true, 'Event type is required'],
      enum: {
        values: Object.values(EventType),
        message: '{VALUE} is not a valid event type'
      }
    },
    methods: { 
      type: [String], 
      required: [true, 'At least one method is required'],
      enum: {
        values: Object.values(DeliveryMethod),
        message: '{VALUE} is not a valid delivery method'
      },
      validate: {
        validator: (methods: DeliveryMethod[]) => methods.length > 0,
        message: 'At least one delivery method must be specified'
      }
    }
  }]
}, {
  timestamps: true
});

export default model<IUser>('User', userSchema);