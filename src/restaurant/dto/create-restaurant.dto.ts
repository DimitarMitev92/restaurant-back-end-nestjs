import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUUID()
  locationId: string;

  @IsNotEmpty()
  openHour: string;

  @IsNotEmpty()
  closeHour: string;
}
