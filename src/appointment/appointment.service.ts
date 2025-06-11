import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto, EditAppointmentDto } from './dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}
  async GetAllAppointmentsAt(time: number) {
    const now = new Date();
    const timeRange = new Date(now.getTime() + time * 1000); // Add 1 hour
    const appointments = await this.prisma.appointment.findMany({
      where: { endDate: { gte: now, lte: timeRange } },
    });
    return appointments;
  }
  async GetAllAppointments() {
    const appointments = await this.prisma.appointment.findMany({
      orderBy: { id: 'asc' },
    });
    return appointments;
  }
  async GetPatientAppointments(patientId: number) {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId: patientId },
      orderBy: { id: 'desc' },
    });
    return appointments;
  }

  async GetDoctorAppointments(doctorId: number) {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId: doctorId },
      orderBy: { id: 'desc' },
    });
    return appointments;
  }
  async GetMyAppointments(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        doctor: {
          include: {
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
      return user?.doctor?.appointments;
    } else {
      return user?.patient?.appoinments;
    }
  }
  async GetAppointment(appoitmentId: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appoitmentId },
      include: {
        doctor: { omit: { createdAt: true, updatedAt: true, userId: true } },
        patient: { omit: { createdAt: true, updatedAt: true, userId: true } },
      },
    });
    if (appointment) {
      return appointment;
    } else {
      throw new NotFoundException('There is no Appointment with this ID.');
    }
  }
  async VerifyAppointment(appointmentId: number) {
    const appointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        verified: true,
      },
    });
    return appointment;
  }
  async RescheduleAppointment(
    appointmentId: number,
    date: Date,
    endDate: Date,
  ) {
    const appointment = await this.prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        date,
        endDate,
      },
    });
    return appointment;
  }
  async AddAppointment(dto: CreateAppointmentDto) {
    const appointment = await this.prisma.appointment.create({
      data: {
        ...dto,
      },
    });
    return appointment;
  }
  async EditAppointment(appointmentId: number, dto: EditAppointmentDto) {
    try {
      const appointment = await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          ...dto,
        },
      });
      return appointment;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException('There is no Appointment with this ID.');
      }
    }
  }
  async DeleteAppintment(appointmentId: number) {
    try {
      await this.prisma.appointment.delete({
        where: { id: appointmentId },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException('There is no Appointment with this ID.');
      }
    }
  }
}
