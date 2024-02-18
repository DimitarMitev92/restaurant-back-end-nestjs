import {
  IsNotEmpty,
  IsUUID,
  Min,
  IsInt,
  IsEnum,
  IsString,
} from 'class-validator';
import { PickType } from 'src/order/entities/order.entity';

export class MealDetailDto {
  @IsNotEmpty()
  @IsUUID()
  mealId: string;

  @IsInt()
  @Min(1)
  count: number;
}
export class CreateOrderDetailDto {
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
  @IsNotEmpty({ each: true })
  meals: MealDetailDto[];
}
