import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from '../entities/menu.entity';
export class CreateMenuDto {
  @IsString()
  @IsOptional()
  @IsEnum(Type)
  type?: string;
  @IsNotEmpty()
  @IsUUID()
  restaurantId: string;
}
