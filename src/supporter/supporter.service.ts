import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateSupporterDto } from './dto/create-supporter.dto';
import { UpdateSupporterDto } from './dto/update-supporter.dto';
import { Supporter } from './entities/supporter.entity';

@Injectable()
export class SupporterService {
  constructor(
    @InjectModel('Supporter') private supporterModel: Model<Supporter>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async createSupporter(
    createSupporterDto: CreateSupporterDto,
    user?: any,
  ): Promise<Supporter> {
    const { telegramId, username, isAvailable } = createSupporterDto;

    const newSupporter = new this.supporterModel({
      telegramId,
      username,
      isAvailable,
      userId: user ? user._id : undefined,
      rating: createSupporterDto.rating || 0,
      chatId: createSupporterDto.chatId || null,
      messageId: createSupporterDto.messageId || null,
    });

    await newSupporter.save();
    return newSupporter;
  }

  async addUsersToSupport(
    supportId: string,
    users: string[],
  ): Promise<Supporter> {
    return this.supporterModel
      .findByIdAndUpdate(
        supportId,
        { $addToSet: { users: { $each: users } } },
        { new: true },
      )
      .exec();
  }

  async findAll(): Promise<Supporter[]> {
    return this.supporterModel.find().exec();
  }

  async findOne(id: string): Promise<Supporter> {
    const supporter = await this.supporterModel.findById(id).exec();
    if (!supporter) {
      throw new NotFoundException(`Supporter with ID ${id} not found`);
    }
    return supporter;
  }

  async update(
    id: string,
    updateSupporterDto: UpdateSupporterDto,
  ): Promise<Supporter> {
    const existingSupporter = await this.supporterModel
      .findByIdAndUpdate(id, updateSupporterDto, { new: true })
      .exec();
    if (!existingSupporter) {
      throw new NotFoundException(`Supporter with ID ${id} not found`);
    }
    return existingSupporter;
  }

  async remove(id: string): Promise<void> {
    const deletedSupporter = await this.supporterModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedSupporter) {
      throw new NotFoundException(`Supporter with ID ${id} not found`);
    }
  }
}
