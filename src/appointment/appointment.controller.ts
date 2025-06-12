import {
  Controller,
  Get,
  Body,
  UseGuards,
  Post,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { GetUser } from 'src/auth/decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateAppointmentDto, EditAppointmentDto } from './dto';
import { IsAppointmentOwnerGuard } from '../Guards';
import { AdminGuard } from 'src/Guards/Admin-guard';
@Controller('appointments')
export class AppointmentController {
  constructor(private AppointmentService: AppointmentService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  GetAllAppointments() {
    return this.AppointmentService.GetAllAppointments();
  }

  @Get('/all/:time')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  GetAllAppointmentsAt(@Param('time') time: number) {
    return this.AppointmentService.GetAllAppointmentsAt(time);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  GetMyAppointments(@GetUser('id') userId: number) {
    return this.AppointmentService.GetMyAppointments(userId);
  }

  @Get('/patient/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  GetPatientAppointments(@Param('id') patientId: number) {
    return this.AppointmentService.GetPatientAppointments(patientId);
  }

  @Get('/doctor/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  GetDoctorAppointments(@Param('id') doctorId: number) {
    return this.AppointmentService.GetDoctorAppointments(doctorId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  GetAppointment(@Param('id') appointmentId: number) {
    return this.AppointmentService.GetAppointment(appointmentId);
  }

  @Patch('/verify/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  VerifyAppointment(@Param('id') appointmentId: number) {
    return this.AppointmentService.VerifyAppointment(appointmentId);
  }

  @Patch('/reschedule/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  RescheduleAppointment(
    @Param('id') appointmentId: number,
    @Body('date') date: Date,
    @Body('endDate') endDate: Date,
  ) {
    return this.AppointmentService.RescheduleAppointment(
      appointmentId,
      date,
      endDate,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), IsAppointmentOwnerGuard)
  EditAppointment(
    @Body() dto: EditAppointmentDto,
    @Param('id') appointmentId: number,
  ) {
    return this.AppointmentService.EditAppointment(appointmentId, dto);
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  AddAppointment(@Body() dto: CreateAppointmentDto) {
    return this.AppointmentService.AddAppointment(dto);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  DeleteAppointment(@Param('id') appointmentId: number) {
    return this.AppointmentService.DeleteAppintment(appointmentId);
  }
}
