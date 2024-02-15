import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateOrderDetailDto {
  @IsUUID()
  @IsNotEmpty()
  mealId: string;

  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  count: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  totalPrice: number;
}
