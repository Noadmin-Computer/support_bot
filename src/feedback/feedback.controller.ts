import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackDocument } from './entities/feedback.entity';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async create(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<FeedbackDocument> {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  async findAll(): Promise<FeedbackDocument[]> {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FeedbackDocument> {
    return this.feedbackService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<FeedbackDocument> {
    return this.feedbackService.remove(id);
  }
}
