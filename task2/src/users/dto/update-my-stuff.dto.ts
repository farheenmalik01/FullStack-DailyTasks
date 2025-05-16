import { PartialType } from '@nestjs/swagger';
import { CreateMyStuffDto } from './create-my-stuff.dto';

export class UpdateMyStuffDto extends PartialType(CreateMyStuffDto) {}
