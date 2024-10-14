import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';
import { FilterMessagesDto } from './dto/filter-message.dto';
import { MessageDocument } from './entities/message.entity';
import { MessagesService } from './message.service';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageDocument> {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  async findAll(): Promise<MessageDocument[]> {
    return this.messagesService.findAll();
  }

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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MessageDocument> {
    return this.messagesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.messagesService.remove(id);
  }
}
