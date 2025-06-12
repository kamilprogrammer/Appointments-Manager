/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { AdminGuard } from './Admin-guard';

@Injectable()
export class IsAppointmentOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user: any = request.user;
    const appointmentId = Number(request.params.id);

    if (!appointmentId) {
      throw new ForbiddenException('Invalid appointment ID');
    }

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new ForbiddenException('Appointment not found');
    }

    const isDoctor = user?.doctor?.id === appointment.doctorId || AdminGuard;

    if (!isDoctor) {
      throw new ForbiddenException(
        'You are not allowed to edit this appointment',
      );
    }

    return true;
  }
}
