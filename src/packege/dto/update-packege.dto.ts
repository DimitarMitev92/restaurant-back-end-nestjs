import { PartialType } from '@nestjs/mapped-types';
import { CreatePackegeDto } from './create-packege.dto';

export class UpdatePackegeDto extends PartialType(CreatePackegeDto) {}
