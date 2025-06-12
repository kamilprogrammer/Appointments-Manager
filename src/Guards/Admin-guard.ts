/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user: any = request.user;
    console.log(user);
    const password = await argon.verify(
      user?.password,
      this.config.get('SECRET_CODE').toString(),
    );
    if (user && user?.doctor) {
      const username = user?.doctor.firstname + user?.doctor.lastname;
      if (username === this.config.get('ADMIN_USERNAME') && password) {
        return true;
      }
    } else {
      return false;
    }
    return false;
  }
}
