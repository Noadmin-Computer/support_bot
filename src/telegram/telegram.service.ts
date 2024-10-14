import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as TelegramBot from 'node-telegram-bot-api';
import { FeedbackDocument } from 'src/feedback/entities/feedback.entity';

import { Supporter } from 'src/supporter/entities/supporter.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateTelegramDto } from './dto/create-telegram.dto';
import { UpdateTelegramDto } from './dto/update-telegram.dto';
import { MessageDocument } from 'src/message/entities/message.entity';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly token = process.env.TELEGRAM_TOKEN;

  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Supporter') private supporterModel: Model<Supporter>,
    @InjectModel('Message') private messageModel: Model<MessageDocument>,
    @InjectModel('Feedback') private feedbackModel: Model<FeedbackDocument>,
  ) {
    this.bot = new TelegramBot(this.token, { polling: true });
  }

  async onModuleInit() {
    this.bot.onText(/\/(start|end)/, (msg) => this.handleCommand(msg));

    this.bot.on('message', (msg) => this.handleUserMessage(msg));
    this.bot.on('callback_query', (query) => this.handleCallbackQuery(query));
  }

  async create(createTelegramDto: CreateTelegramDto) {
    const user = new this.userModel(createTelegramDto);
    return user.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateTelegramDto: UpdateTelegramDto) {
    return this.userModel
      .findByIdAndUpdate(id, updateTelegramDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  private async handleCommand(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const command = msg.text?.split(' ')[0] || '';

    if (command === '/start') {
      await this.handleStartCommand(msg);
    } else if (command === '/end') {
      await this.handleEndCommand(msg);
    }
  }

  private async handleStartCommand(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const firstName = msg.from?.first_name || 'Без имени';
    const username = msg.from?.username || 'Без имени';

    const user = await this.userModel.findOne({ telegramId: chatId });

    if (user?.isConnectedToSupport) {
      const connectedSupporter = await this.supporterModel.findOne({
        telegramId: user.connectedSupporterId,
      });

      if (connectedSupporter) {
        this.bot.sendMessage(
          chatId,
          `🚨 Вы уже подключены к суппорту ${connectedSupporter.username}. Вы можете продолжить общение.`,
        );
        return;
      }
    }

    const availableSupporter = await this.findAvailableSupporter();

    if (availableSupporter) {
      await this.userModel.findOneAndUpdate(
        { telegramId: chatId },
        {
          isConnectedToSupport: true,
          connectedSupporterId: availableSupporter.telegramId,
          firstName,
          username,
        },
        { upsert: true, new: true },
      );

      await this.supporterModel.findByIdAndUpdate(availableSupporter._id, {
        isAvailable: false,
      });

      this.bot.sendMessage(
        chatId,
        `🎉 Вы подключены к суппорту ${availableSupporter.username}! Напишите ваше сообщение, и вам помогут. 💬`,
      );

      this.bot.sendMessage(
        availableSupporter.telegramId,
        `👤 Пользователь ${firstName} (@${username}) подключился. Вы можете начать общение. 🌟`,
      );
    } else {
      this.bot.sendMessage(
        chatId,
        '🚫 Извините, в данный момент нет доступных суппортов. Пожалуйста, попробуйте позже.',
      );
    }
  }

  private async handleEndCommand(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const user = await this.userModel.findOne({ telegramId: chatId });

    if (user?.isConnectedToSupport) {
      const supporter = await this.supporterModel.findOne({
        telegramId: user.connectedSupporterId,
      });

      if (supporter) {
        await this.supporterModel.findByIdAndUpdate(supporter._id, {
          isAvailable: true,
        });

        this.bot.sendMessage(
          supporter.telegramId,
          `👤 Пользователь ${user.username || 'Без имени'} завершил разговор.`,
        );
      }

      // Обновите статус пользователя
      user.isConnectedToSupport = false;
      user.connectedSupporterId = null;
      await user.save();

      this.sendFeedbackRequest(chatId);

      this.bot.sendMessage(
        chatId,
        '❗ Вы завершили разговор с суппортом. Если вам потребуется помощь, вы можете снова обратиться в поддержку.',
      );
    } else {
      this.bot.sendMessage(
        chatId,
        '❗ Вы не подключены к суппорту. Используйте /start для подключения.',
      );
    }
  }

  private async handleUserMessage(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const user = await this.userModel.findOne({ telegramId: chatId });

    if (user?.isConnectedToSupport) {
      const supporter = await this.supporterModel.findOne({
        telegramId: user.connectedSupporterId,
      });

      if (supporter) {
        const message = {
          text: msg.text || 'No text provided',
          receiverId: supporter._id,
          senderId: user._id,
          chatId: chatId.toString(),
        };

        await this.messageModel.create(message);
        this.bot.sendMessage(supporter.telegramId, msg.text);
      }
    }
  }

  private async handleCallbackQuery(query: TelegramBot.CallbackQuery) {
    const chatId = query.message.chat.id;
    const feedback = query.data?.startsWith('feedback_')
      ? parseInt(query.data.replace('feedback_', ''), 10)
      : null;
    const messageId = query.message.message_id;

    console.log('Received callback query data:', query.data);
    console.log('Parsed feedback rating:', feedback);

    try {
      // Найти пользователя по chatId
      const user = await this.userModel.findOne({ telegramId: chatId }).exec();
      if (!user) {
        this.bot.sendMessage(
          chatId,
          '❗ Не удалось найти пользователя. Отзыв не может быть обработан.',
        );
        return;
      }

      // Найти суппортера, если пользователь подключен к суппорту
      let supporter = null;
      if (user.isConnectedToSupport) {
        supporter = await this.supporterModel
          .findOne({ telegramId: user.connectedSupporterId })
          .exec();
        console.log('Found supporter:', supporter);
      }

      if (feedback === null || feedback < 1 || feedback > 4) {
        throw new Error('Invalid feedback rating');
      }

      // Создать запись отзыва
      const feedbackEntry = new this.feedbackModel({
        chatId,
        rating: feedback,
        messageId,
        userId: user._id, // Установить ID пользователя
        supporterId: supporter ? supporter._id : null, // Установить ID суппортера, если он есть
      });

      await feedbackEntry.save();

      // Добавить отзыв в пользователя и суппортера, если супортер существует
      user.feedback.push(feedbackEntry._id as Types.ObjectId);
      await user.save();

      if (supporter) {
        supporter.feedback.push(feedbackEntry._id as Types.ObjectId);
        await supporter.save();
      }

      this.bot.sendMessage(chatId, 'Спасибо за ваш отзыв! 🥳');
    } catch (error) {
      console.error('Error processing callback query:', error);
      this.bot.sendMessage(
        chatId,
        '❗ Произошла ошибка при обработке вашего отзыва. Пожалуйста, попробуйте снова.',
      );
    } finally {
      this.bot.answerCallbackQuery(query.id);
    }
  }

  private async findAvailableSupporter() {
    return this.supporterModel.findOne({ isAvailable: true }).exec();
  }

  private sendFeedbackRequest(chatId: number) {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '👍 Хорошо', callback_data: 'feedback_4' },
            { text: '😐 Нормально', callback_data: 'feedback_3' },
          ],
          [
            { text: '👎 Плохо', callback_data: 'feedback_2' },
            { text: '😡 Ужасно', callback_data: 'feedback_1' },
          ],
        ],
      },
    };

    this.bot.sendMessage(chatId, 'Как вы оцените нашу поддержку?', options);
  }
}
