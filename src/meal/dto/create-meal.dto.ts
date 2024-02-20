import { IsString, IsNotEmpty, IsUUID, IsOptional, Min } from 'class-validator';

export class CreateMealDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  picture: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsNotEmpty()
  startHour: string;

  @IsNotEmpty()
  endHour: string;

  @Min(0)
  @IsNotEmpty()
  price: number;

  @Min(0)
  @IsNotEmpty()
  weight: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  menuId: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  packageId: string;
}
