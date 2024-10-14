import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { SupporterSchema } from './entities/supporter.entity';
import { SupporterController } from './supporter.controller';
import { SupporterService } from './supporter.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Supporter', schema: SupporterSchema },
      { name: 'User', schema: UserSchema },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [SupporterController],
  providers: [SupporterService],
  exports: [MongooseModule],
})
export class SupporterModule {}
