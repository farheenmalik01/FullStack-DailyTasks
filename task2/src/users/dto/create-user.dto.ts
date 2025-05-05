import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongpassword', description: 'User password', minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/\d/, { message: 'Password must contain a number' })
  @Matches(/^\S*$/, { message: 'Password cannot contain spaces' })
  password: string;
}