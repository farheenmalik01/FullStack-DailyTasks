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

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/\d/, { message: 'Password must contain a number' })
  @Matches(/^\S*$/, { message: 'Password cannot contain spaces' })
  password: string;
}