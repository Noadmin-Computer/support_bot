import mongoose, { Document, Schema } from 'mongoose';

export interface MessageDocument extends Document {
  senderId: string;
  receiverId: string;
  text: string;
  chatId: string;
  createdAt: Date;
}

const MessageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  chatId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Экспортируем как MessageModel
export const MessageModel = mongoose.model<MessageDocument>(
  'Message',
  MessageSchema,
);

export { MessageSchema };
