// user.entity.ts
import { Document, Schema, Types } from 'mongoose';

export const UserSchema = new Schema({
  telegramId: Number,
  isConnectedToSupport: Boolean,
  connectedSupporterId: Number,
  firstName: String,
  username: String,
  chatId: Number,
  messageId: Number,
  feedback: [{ type: Schema.Types.ObjectId, ref: 'Feedback' }],
  totalRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
});

export interface User extends Document {
  telegramId: number;
  isConnectedToSupport: boolean;
  connectedSupporterId: number;
  firstName: string;
  username: string;
  feedback: Types.ObjectId[];
  chatId?: number;
  messageId?: number;
  totalRating: number;
  ratingCount: number;
  averageRating: number;
}

UserSchema.virtual('averageRating').get(function () {
  return this.ratingCount ? this.totalRating / this.ratingCount : 0;
});
