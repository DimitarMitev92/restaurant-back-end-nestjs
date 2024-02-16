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

// @ValidatorConstraint({ name: 'CustomDate', async: false })
// export class CustomDateValidator implements ValidatorConstraintInterface {
//   validate(text: string) {
//     const dateRegex = /^(\d{4})\-(\d{2})\-(\d{2})$/;
//     if (!dateRegex.test(text)) return false;

//     const [_, day, month, year] = text.match(dateRegex);
//     const date = new Date(`${year}-${month}-${day}`);
//     return !isNaN(date.getTime());
//   }

//   defaultMessage() {
//     return 'Date must be in DD.MM.YYYY format';
//   }
// }

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

  @IsString()
  @IsOptional()
  additionalNote: string;

  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  endDate: string;

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
