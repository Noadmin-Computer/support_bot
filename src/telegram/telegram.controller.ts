import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-strategy.guard';
import { CreateTelegramDto } from './dto/create-telegram.dto';
import { UpdateTelegramDto } from './dto/update-telegram.dto';
import { TelegramService } from './telegram.service';
@ApiBearerAuth('access-token')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTelegramDto: CreateTelegramDto) {
    return this.telegramService.create(createTelegramDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.telegramService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.telegramService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTelegramDto: UpdateTelegramDto,
  ) {
    return this.telegramService.update(id, updateTelegramDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.telegramService.remove(id);
  }
}
