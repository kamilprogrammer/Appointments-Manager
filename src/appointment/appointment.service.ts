import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}
  async GetAppointments(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        doctor: {
          select: {
            id: true,
            appointments: true,
          },
        },
        patient: {
          include: {
            appoinments: true,
          },
        },
      },
    });
    if (user?.doctor) {
      return user.doctor.appointments;
    } else {
      return user?.patient?.appoinments;
    }
  }
  async GetAppointment(appoitmentId: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appoitmentId },
      include: {
        doctor: true,
        patient: true,
      },
    });
    if (appointment) {
      return appointment;
    } else {
      throw new NotFoundException('There is no Appointment with this ID.');
    }
  }

  async AddAppointment(userId: number, dto: CreateAppointmentDto) {
    const appointment = await this.prisma.appointment.create({
      data: {
        ...dto,
      },
    });
    return appointment;
  }
}
