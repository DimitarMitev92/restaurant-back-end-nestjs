import { IsUUID, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Type } from '../entities/menu.entity';
export class CreateMenuDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(Type)
  type: string;
  @IsNotEmpty()
  @IsUUID()
  restaurantId: string;
}
