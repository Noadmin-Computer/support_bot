import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'ID',
    description: 'Unique Telegram ID of the user',
  })
  @IsString()
  @IsNotEmpty()
  telegramId: number;

  @ApiProperty({
    example: 'Username',
    description: 'Username of the user',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Supporter ID',
  })
  @IsString()
  connectedSupporterId: string;
}
