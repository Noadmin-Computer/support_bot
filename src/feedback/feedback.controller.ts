import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-strategy.guard';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackDocument } from './entities/feedback.entity';
import { FeedbackService } from './feedback.service';

@ApiBearerAuth('access-token')
@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<FeedbackDocument> {
    return this.feedbackService.create(createFeedbackDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<FeedbackDocument[]> {
    return this.feedbackService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FeedbackDocument> {
    return this.feedbackService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<FeedbackDocument> {
    return this.feedbackService.remove(id);
  }
}
