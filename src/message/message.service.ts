import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose'; // Import FilterQuery
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDocument } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message')
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async filterMessages(
    filter: Partial<MessageDocument>,
    limit: number = 50,
    page: number = 1,
  ) {
    const currentPage = page >= 1 ? page : 1;
    const offset = (currentPage - 1) * limit;

    // Construct the filter dynamically, excluding undefined values
    const constructedFilter: FilterQuery<MessageDocument> = {};
    if (filter.senderId) constructedFilter.senderId = filter.senderId;
    if (filter.receiverId) constructedFilter.receiverId = filter.receiverId;
    if (filter.chatId) constructedFilter.chatId = filter.chatId;

    // Logging for debugging
    console.log('Constructed Filter:', constructedFilter);
    console.log('Limit:', limit);
    console.log('Offset:', offset);

    const [totalItems, messages] = await Promise.all([
      this.messageModel.countDocuments(constructedFilter).exec(),
      this.messageModel
        .find(constructedFilter)
        .sort({ createdAt: 1 })
        .skip(offset)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = currentPage < totalPages;

    return {
      messages,
      totalPages,
      currentPage,
      nextPage,
    };
  }

  async getMessagesByChatId(
    chatId: string,
    limit: number = 50,
    offset: number = 0,
  ) {
    return this.messageModel
      .find({ chatId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .skip(offset)
      .exec();
  }

  async create(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  async findAll(): Promise<MessageDocument[]> {
    return this.messageModel.find().exec();
  }

  async findOne(id: string): Promise<MessageDocument> {
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async remove(id: string): Promise<void> {
    const result = await this.messageModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
  }
}
