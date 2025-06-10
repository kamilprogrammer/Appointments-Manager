import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}
  SignUp() {
    console.log('here');
  }
}
