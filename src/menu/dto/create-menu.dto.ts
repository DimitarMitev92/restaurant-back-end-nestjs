import { IsUUID, IsNotEmpty, IsString } from 'class-validator';
export class CreateMenuDto {
  @IsNotEmpty()
  @IsString()
  menuTypeId: string;

  @IsNotEmpty()
  @IsUUID()
  restaurantId: string;
}
