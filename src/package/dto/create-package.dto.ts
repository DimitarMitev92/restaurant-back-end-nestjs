import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
export class CreatePackageDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @Min(0)
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
