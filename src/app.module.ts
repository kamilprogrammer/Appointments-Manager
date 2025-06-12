import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppoinmentModule } from './appointment/appointment.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuditLogService } from './audit-log/audit-log.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AppoinmentModule,
    PatientModule,
    DoctorModule,
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuditLogService],
})
export class AppModule {}
