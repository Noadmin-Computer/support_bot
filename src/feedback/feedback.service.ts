import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supporter } from '../supporter/entities/supporter.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackDocument } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel('Feedback')
    private readonly feedbackModel: Model<FeedbackDocument>,
    @InjectModel('Supporter')
    private readonly supporterModel: Model<Supporter>,
  ) {}

  async create(
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<FeedbackDocument> {
    let supporterId = createFeedbackDto.supporterId;

    console.log('Initial supporterId:', supporterId);
    console.log('Chat ID:', createFeedbackDto.chatId);

    if (!supporterId) {
      console.log('Attempting to find supporter by chatId');
      const supporter = await this.supporterModel
        .findOne({ chatId: createFeedbackDto.chatId })
        .exec();

      if (!supporter) {
        console.log(
          `No supporter found for chatId ${createFeedbackDto.chatId}`,
        );
      } else {
        console.log('Supporter found:', supporter);
        supporterId = supporter._id.toString();
        console.log('Supporter ID found:', supporterId);
      }
    }

    if (!supporterId) {
      console.log(`Supporter not found for chatId ${createFeedbackDto.chatId}`);
      throw new NotFoundException(
        `Supporter not found for chatId ${createFeedbackDto.chatId}`,
      );
    }

    const feedback = new this.feedbackModel({
      ...createFeedbackDto,
      supporterId: supporterId,
    });

    console.log('Saving feedback:', feedback);
    return feedback.save();
  }

  async findAll(): Promise<FeedbackDocument[]> {
    return this.feedbackModel.find().exec();
  }

  async findOne(id: string): Promise<FeedbackDocument> {
    return this.feedbackModel.findById(id).exec();
  }

  async remove(id: string): Promise<FeedbackDocument> {
    return this.feedbackModel.findByIdAndDelete(id).exec();
  }
}
