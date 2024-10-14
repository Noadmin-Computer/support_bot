import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'email@email.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  password: string;
}
