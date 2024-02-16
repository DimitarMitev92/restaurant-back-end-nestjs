import { IsEmail, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @IsNotEmpty()
  readonly oldPassword: string;

  @IsNotEmpty()
  readonly newPassword: string;
}
