import { IsEmail, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
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
  @IsUUID()
  readonly locationId: string;

  @IsEnum(UserRights, { message: 'Invalid user rights' })
  readonly rights: UserRights;
}
