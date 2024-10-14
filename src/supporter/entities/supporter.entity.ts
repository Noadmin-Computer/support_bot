import { Document, Schema } from 'mongoose';

export const SupporterSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, default: 0 },
  chatId: { type: Number, default: null },
  messageId: { type: Number, default: null },
  telegramId: { type: String },
  username: { type: String },
  isAvailable: { type: Boolean, default: true },
});

export interface Supporter extends Document {
  userId: string;
  rating: number;
  chatId: number | null;
  messageId: number | null;
  telegramId: string;
  username: string;
  isAvailable: boolean;
}
