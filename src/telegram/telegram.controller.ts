import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTelegramDto } from './dto/create-telegram.dto';
import { UpdateTelegramDto } from './dto/update-telegram.dto';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async create(@Body() createTelegramDto: CreateTelegramDto) {
    return this.telegramService.create(createTelegramDto);
  }

  @Get()
  async findAll() {
    return this.telegramService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.telegramService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTelegramDto: UpdateTelegramDto,
  ) {
    return this.telegramService.update(id, updateTelegramDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.telegramService.remove(id);
  }
}
