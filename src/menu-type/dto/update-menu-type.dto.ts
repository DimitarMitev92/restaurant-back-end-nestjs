import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuTypeDto } from './create-menu-type.dto';

export class UpdateMenuTypeDto extends PartialType(CreateMenuTypeDto) {}
