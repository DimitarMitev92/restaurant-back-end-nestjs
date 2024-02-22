import { IsUUID, IsNotEmpty } from 'class-validator';
export class CreateMenuDto {
  @IsNotEmpty()
  @IsUUID()
  menuTypeId: string;

  @IsNotEmpty()
  @IsUUID()
  restaurantId: string;
}
