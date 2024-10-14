import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupporterModule } from 'src/supporter/supporter.module';
import { UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => SupporterModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
