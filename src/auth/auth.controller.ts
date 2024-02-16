import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from './public.decorator';

import { LoggingUser } from './auth.service';
import { SignInDto } from 'src/user/dto/sign-in.dto';
import { ChangePasswordDto } from 'src/user/dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('sign-in')
  signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ user: LoggingUser; access_token: string }> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('sign-up')
  singUp(
    @Body() signUp: CreateUserDto,
  ): Promise<
    | { user: LoggingUser; access_token: string }
    | { statusCode: number; message: string }
  > {
    return this.authService.signUp(signUp);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ user: LoggingUser; access_token: string }> {
    return this.authService.changePassword(changePasswordDto);
  }
}
