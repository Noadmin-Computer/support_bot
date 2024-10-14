import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSupporterDto } from './dto/create-supporter.dto';
import { UpdateSupporterDto } from './dto/update-supporter.dto';
import { Supporter } from './entities/supporter.entity';
import { SupporterService } from './supporter.service';

@ApiTags('Supporter')
@Controller('supporter')
export class SupporterController {
  constructor(private readonly supporterService: SupporterService) {}

  @Post()
  async createSupporter(
    @Body() createSupporterDto: CreateSupporterDto,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.supporterService.createSupporter(createSupporterDto, user);
  }

  @Put(':supportId/users')
  addUsersToSupport(
    @Param('supportId') supportId: string,
    @Body('users') users: string[],
  ): Promise<Supporter> {
    return this.supporterService.addUsersToSupport(supportId, users);
  }

  @Get()
  findAll() {
    return this.supporterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supporterService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupporterDto: UpdateSupporterDto,
  ) {
    return this.supporterService.update(id, updateSupporterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supporterService.remove(id);
  }
}
