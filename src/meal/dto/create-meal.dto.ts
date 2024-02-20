import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  ValidatorConstraintInterface,
  Validate,
  Min,
  ValidatorConstraint,
} from 'class-validator';

@ValidatorConstraint({ name: 'customTimeValidation', async: false })
class CustomTimeValidation implements ValidatorConstraintInterface {
  validate(text: string) {
    return /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/.test(text);
  }

  defaultMessage() {
    return `The time must be in HH:MM:SS format for a 24-hour clock`;
  }
}
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

  @Validate(CustomTimeValidation)
  @IsNotEmpty()
  startHour: string;

  @Validate(CustomTimeValidation)
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
