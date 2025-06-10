import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}
  @Post('SignUp')
  SignUp(@Body() dto: AuthDto) {
    return this.AuthService.SignUp(dto);
  }
  @HttpCode(200)
  @Post('SignIn')
  SignIn(@Body() dto: AuthDto) {
    return this.AuthService.SiginIn(dto);
  }
}
