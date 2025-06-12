import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto, EditAppointmentDto } from './dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { formatUTCToLocal } from './LocalDate';
import { AuditLogService } from 'src/audit-log/audit-log.service';
@Injectable()
export class AppointmentService {
  constructor(
    private prisma: PrismaService,
    private log: AuditLogService,
  ) {}
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
  async VerifyAppointment(appointmentId: number, userId: number) {
    try {
      // Getting the old Appointment for the Logging Process.
      const oldAppointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
      });
      const appointment = await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          verified: true,
        },
      });

      // Logging Logic
      this.log
        .AddLog({
          entityId: appointment?.id,
          action: 'VERIFY',
          changes: { old: oldAppointment, new: appointment },
          entity: 'Appointment',
          userId: userId,
        })
        .catch((err) => console.error('Audit log failed:', err));

      return appointment;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException('There is no Appointment with this ID.');
      }
    }
  }
  async RescheduleAppointment(
    appointmentId: number,
    date: Date,
    endDate: Date,
    userId: number,
  ) {
    // Getting the old Appointment for the Logging Process.
    const oldAppointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    const appointment = await this.prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        date,
        endDate,
      },
    });

    // Logging Logic
    this.log
      .AddLog({
        entityId: appointment?.id,
        action: 'RESCHEDULE',
        changes: { old: oldAppointment, new: appointment },
        entity: 'Appointment',
        userId: userId,
      })
      .catch((err) => console.error('Audit log failed:', err));

    return appointment;
  }
  async AddAppointment(dto: CreateAppointmentDto, userId: number) {
    // Check for time conflicts for the same doctor
    const conflictChecker = await this.prisma.appointment.findFirst({
      where: {
        doctorId: dto.doctorId,
        AND: [{ date: { lt: dto.endDate } }, { endDate: { gt: dto.date } }],
      },
    });

    if (dto.endDate <= dto.date) {
      throw new BadRequestException(
        'Appointment endDate must be after startDate.',
      );
    }
    if (conflictChecker) {
      throw new ConflictException('This time slot is already booked.');
    } else {
      const localDate = formatUTCToLocal(dto?.date);
      const localendDate = formatUTCToLocal(dto?.endDate);
      const appointment = await this.prisma.appointment.create({
        data: {
          ...dto,
          date: localDate,
          endDate: localendDate,
        },
        include: {
          doctor: true,
          patient: true,
        },
      });

      // Logging Logic
      this.log
        .AddLog({
          entityId: appointment?.id,
          action: 'CREATE',
          changes: { old: appointment, new: appointment },
          entity: 'Appointment',
          userId: userId,
        })
        .catch((err) => console.error('Audit log failed:', err));

      return appointment;
    }
  }
  async EditAppointment(
    appointmentId: number,
    dto: EditAppointmentDto,
    userId: number,
  ) {
    // Check for time conflicts for the same doctor
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: true,
        patient: true,
      },
    });

    const conflictChecker = await this.prisma.appointment.findFirst({
      where: {
        doctorId: appointment?.doctorId,
        id: { not: appointmentId },

        AND: [{ date: { lt: dto.endDate } }, { endDate: { gt: dto.date } }],
      },
    });
    if (dto.endDate <= dto.date) {
      throw new BadRequestException(
        'Appointment endDate must be after startDate.',
      );
    }

    if (conflictChecker) {
      throw new ConflictException('This time slot is already booked.');
    }
    try {
      const localDate = formatUTCToLocal(dto.date);
      const localendDate = formatUTCToLocal(dto.endDate);

      const appointmentUpdated = await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          ...dto,
          date: localDate,
          endDate: localendDate,
        },
        include: {
          doctor: true,
          patient: true,
        },
      });

      // Logging Logic
      this.log
        .AddLog({
          entityId: appointmentUpdated.id,
          action: 'UPDATE',
          changes: { old: appointment, new: appointmentUpdated },
          entity: 'Appointment',
          userId: userId,
        })
        .catch((err) => console.error('Audit log failed:', err));
      return appointmentUpdated;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException('There is no Appointment with this ID.');
      }
    }
  }
  async DeleteAppintment(appointmentId: number, userId: number) {
    try {
      const oldAppointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          doctor: true,
          patient: true,
        },
      });
      await this.prisma.appointment.delete({
        where: { id: appointmentId },
      });

      // Logging Logic
      if (oldAppointment) {
        this.log
          .AddLog({
            entityId: oldAppointment?.id,
            action: 'DELETE',
            changes: { old: oldAppointment, new: {} },
            entity: 'Appointment',
            userId: userId,
          })
          .catch((err) => console.error('Audit log failed:', err));
      }
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException('There is no Appointment with this ID.');
      }
    }
  }
}
