import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackSchema } from 'src/feedback/entities/feedback.entity';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { MessageSchema } from 'src/message/entities/message.entity';
import { MessagesModule } from 'src/message/message.module';
import { SupporterSchema } from 'src/supporter/entities/supporter.entity';
import { UserSchema } from 'src/users/entities/user.entity';
import { TelegramService } from './telegram.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: 'Feedback', schema: FeedbackSchema }]),
    MongooseModule.forFeature([{ name: 'Supporter', schema: SupporterSchema }]),
    MessagesModule,
    FeedbackModule,
  ],
  providers: [TelegramService],
})
export class TelegramModule {}
