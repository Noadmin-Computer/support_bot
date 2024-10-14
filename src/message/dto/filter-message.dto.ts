import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterMessagesDto {
  @ApiPropertyOptional({ description: 'Sender ID of the message' })
  @IsString()
  @IsOptional()
  senderId?: string;

  @ApiPropertyOptional({ description: 'Receiver ID of the message' })
  @IsString()
  @IsOptional()
  receiverId?: string;

  @ApiPropertyOptional({ description: 'Chat ID of the message' })
  @IsString()
  @IsOptional()
  chatId?: string;

  @ApiPropertyOptional({
    description: 'Limit the number of results',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;
}
