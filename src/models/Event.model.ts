import { Schema, model, Document } from 'mongoose';
import { EventType, EventPriority } from '../types/common';

export interface IEvent extends Document {
  type: EventType;
  priority: EventPriority;
  data: {
    title: string;
    description: string;
  };
  createdAt: Date;
}

const eventSchema = new Schema<IEvent>({
  type: { type: String, enum: Object.values(EventType), required: true },
  priority: { type: String, enum: Object.values(EventPriority), required: true },
  data: {
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

export default model<IEvent>('Event', eventSchema);