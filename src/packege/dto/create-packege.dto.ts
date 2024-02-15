import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePackegeDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
