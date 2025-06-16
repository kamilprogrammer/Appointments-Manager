import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppoinmentModule } from './appointment/appointment.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuditLogService } from './audit-log/audit-log.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      isGlobal: true,
    }),
    AuthModule,
    AppoinmentModule,
    PrismaModule,
    ChatModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuditLogService],
})
export class AppModule {}
