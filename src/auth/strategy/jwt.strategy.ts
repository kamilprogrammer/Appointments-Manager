/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('SECRET_CODE'),
    } as any);
  }
  async validate(payload: any) {
    console.log('here');
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        doctor: true,
        patient: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    if (user?.passwordChangedAt && user?.passwordChangedAt !== null) {
      const passwordChangedAt = Math.floor(
        user.passwordChangedAt.getTime() / 1000,
      );
      if (payload.iat < passwordChangedAt) {
        throw new UnauthorizedException(
          'Token invalid due to password change. Please login again.',
        );
      }
    }
    return user;
  }
}
