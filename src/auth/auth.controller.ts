import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}
  @Post('SignUp')
  SignUp(@Body() dto: AuthDto) {
    console.log(dto);
    return this.AuthService.SignUp();
  }

  @Post('SignIn')
  SignIn() {}
}
