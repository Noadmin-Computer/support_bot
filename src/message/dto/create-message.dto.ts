import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsOptional() // Make optional
  senderId?: string;

  @IsString()
  @IsOptional() // Make optional
  receiverId?: string;

  @IsString()
  @IsOptional() // Make optional
  text: string;

  @IsString()
  @IsOptional() // Make optional
  chatId?: string;

  @IsOptional() // You might want to make these fields optional in filtering
  limit?: number;

  @IsOptional()
  offset?: number;
}
