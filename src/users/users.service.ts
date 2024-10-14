import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSupporterDto } from 'src/supporter/dto/create-supporter.dto';
import { Supporter } from 'src/supporter/entities/supporter.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
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
    const {
      userId,
      rating,
      chatId,
      messageId,
      telegramId,
      username,
      isAvailable,
    } = createSupporterDto;

    const effectiveUserId = userId || (user ? user._id : null);

    const newSupporter = new this.supporterModel({
      userId: effectiveUserId || undefined,
      rating: rating || 0,
      chatId: chatId || 0,
      messageId: messageId || 0,
      telegramId,
      username,
      isAvailable,
      users: [],
    });

    await newSupporter.save();

    if (effectiveUserId) {
      const userRecord = await this.userModel.findById(effectiveUserId);
      if (!userRecord) {
        throw new NotFoundException('User not found');
      }

      // Обновление рейтинга пользователя
      userRecord.totalRating += rating; // Добавление текущей оценки
      userRecord.ratingCount += 1; // Увеличение количества оценок
      await userRecord.save(); // Сохранение обновленного пользователя

      // Установка значений chatId и messageId
      newSupporter.chatId = userRecord.chatId || newSupporter.chatId;
      newSupporter.messageId = userRecord.messageId || newSupporter.messageId;

      await newSupporter.save();
    }

    return newSupporter;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return existingUser;
  }

  async remove(id: string): Promise<void> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
