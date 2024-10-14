import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-strategy.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { FilterMessagesDto } from './dto/filter-message.dto';
import { MessageDocument } from './entities/message.entity';
import { MessagesService } from './message.service';
@ApiBearerAuth('access-token')
@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageDocument> {
    return this.messagesService.create(createMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<MessageDocument[]> {
    return this.messagesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter')
  async filterMessages(@Query() filterMessagesDto: FilterMessagesDto) {
    const {
      senderId,
      receiverId,
      chatId,
      limit = 5,
      page = 1,
    } = filterMessagesDto;

    const filter = { senderId, receiverId, chatId };
    return this.messagesService.filterMessages(filter, limit, page);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MessageDocument> {
    return this.messagesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.messagesService.remove(id);
  }
}
