import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
