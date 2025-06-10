import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppoinmentModule } from './appointment/appointment.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';

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
})
export class AppModule {}
