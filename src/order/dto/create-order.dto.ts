import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PickType } from '../entities/order.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @IsNotEmpty()
  @IsUUID()
  restaurantId: string;

  @IsNotEmpty()
  @IsEnum(PickType)
  pickMethod: PickType;

  @IsString()
  additionalInfo: string;
}
