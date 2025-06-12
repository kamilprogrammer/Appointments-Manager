import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AuditLogService } from 'src/audit-log/audit-log.service';
@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, AuditLogService],
})
export class AppoinmentModule {}
