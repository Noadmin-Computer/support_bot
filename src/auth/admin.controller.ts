import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminsService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update.dto';

@ApiTags('Admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Get(':email')
  async findOne(@Param('email') email: string) {
    return this.adminsService.findOne(email);
  }

  @Put(':email')
  async update(
    @Param('email') email: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminsService.update(email, updateAdminDto);
  }

  @Delete(':email')
  async remove(@Param('email') email: string) {
    return this.adminsService.remove(email);
  }

  // Add more endpoints as needed
}
