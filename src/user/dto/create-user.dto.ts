import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRights } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly location: string;

  @IsEnum(UserRights, { message: 'Invalid user rights' })
  readonly rights: UserRights;
}
