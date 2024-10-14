import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackModule } from './feedback/feedback.module';
import { MessagesModule } from './message/message.module';
import { SupporterModule } from './supporter/supporter.module';
import { TelegramModule } from './telegram/telegram.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    SupporterModule,
    TelegramModule,
    MessagesModule,
    FeedbackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
