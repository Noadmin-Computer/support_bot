import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Admin extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken?: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

export type AdminDocument = Admin & Document;
