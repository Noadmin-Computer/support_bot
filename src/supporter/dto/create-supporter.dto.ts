import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSupporterDto {
  @ApiProperty({
    example: 'Telegram ID',
    description: 'Telegram ID of the supporter',
  })
  @IsString()
  telegramId: string;

  @ApiProperty({
    example: 'Username',
    description: 'Username of the supporter',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: true,
    description: 'Availability of the supporter',
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    example: 'someUserId', // Пример userId
    description: 'ID of the user associated with the supporter',
  })
  @IsOptional()
  @IsString()
  userId?: string; // Добавляем userId, чтобы передавать его в DTO

  @ApiProperty({
    example: 5,
    description: 'Rating of the supporter',
  })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({
    example: 123,
    description: 'Chat ID of the supporter',
  })
  @IsOptional()
  @IsNumber()
  chatId?: number;

  @ApiProperty({
    example: 456,
    description: 'Message ID of the supporter',
  })
  @IsOptional()
  @IsNumber()
  messageId?: number;
}
