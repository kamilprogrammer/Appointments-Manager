/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CanActivate } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

export class WsAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  canActivate(context: any): boolean | Promise<boolean> | Observable<boolean> {
    const socket: Socket = context.switchToWs().getClient();
    console.log('here');
    let token;
    if (socket.handshake.headers.authorization) {
      token = socket.handshake.headers.authorization
        .replace('Bearer ', '')
        .trim();
    }
    console.log(token);
    console.log('hey I mhere');

    // Fallback to auth object (for Socket.IO clients)
    if (!token && socket.handshake.auth && socket.handshake.auth.token) {
      token = socket.handshake.auth.token;
    }

    if (!token) {
      socket.disconnect();
      return false;
    }

    console.log('Received token:', token);

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get('SECRET_CODE'),
      });
      socket.data.user = payload;
      console.log('Token verified, user:', payload);
      return true;
    } catch (err) {
      console.log('Invalid token:', err);
      socket.disconnect();
      return false;
    }
  }
}
