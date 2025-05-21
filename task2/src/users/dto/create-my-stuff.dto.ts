import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMyStuffDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
