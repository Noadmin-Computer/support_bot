import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsNumber()
  readonly chatId: number;

  @IsString()
  readonly userId?: string;

  @IsOptional()
  @IsString()
  readonly supporterId?: string;

  @IsString()
  readonly messageId: string;

  @IsString()
  readonly rating: string;

  @IsString()
  readonly message: string;
}
