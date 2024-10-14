import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'email@email.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'strongPassword123',
  })
  @IsString()
  password: string;
}
