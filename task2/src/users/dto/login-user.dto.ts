import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Registered email address'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'yourStrongPassword123',
    description: 'User password'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}