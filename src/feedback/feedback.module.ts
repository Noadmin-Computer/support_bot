import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupporterModule } from '../supporter/supporter.module';
import { FeedbackSchema } from './entities/feedback.entity';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Feedback', schema: FeedbackSchema }]),
    SupporterModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
