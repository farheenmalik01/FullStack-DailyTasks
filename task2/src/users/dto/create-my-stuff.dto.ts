import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateMyStuffDto {
  @ApiProperty({ description: 'Title of the stuff' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the stuff', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
