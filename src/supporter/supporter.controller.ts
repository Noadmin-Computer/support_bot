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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-strategy.guard';
import { CreateSupporterDto } from './dto/create-supporter.dto';
import { UpdateSupporterDto } from './dto/update-supporter.dto';
import { Supporter } from './entities/supporter.entity';
import { SupporterService } from './supporter.service';

@ApiBearerAuth('access-token')
@ApiTags('Supporter')
@Controller('supporter')
export class SupporterController {
  constructor(private readonly supporterService: SupporterService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createSupporter(
    @Body() createSupporterDto: CreateSupporterDto,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.supporterService.createSupporter(createSupporterDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':supportId/users')
  addUsersToSupport(
    @Param('supportId') supportId: string,
    @Body('users') users: string[],
  ): Promise<Supporter> {
    return this.supporterService.addUsersToSupport(supportId, users);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.supporterService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supporterService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupporterDto: UpdateSupporterDto,
  ) {
    return this.supporterService.update(id, updateSupporterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supporterService.remove(id);
  }
}
