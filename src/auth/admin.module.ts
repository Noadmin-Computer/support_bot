import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminsController } from './admin.controller';
import { AdminsService } from './admin.service';
import { Admin, AdminSchema } from './entities/admin.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  providers: [AdminsService],
  controllers: [AdminsController],
  exports: [AdminsService, MongooseModule],
})
export class AdminModule {}
