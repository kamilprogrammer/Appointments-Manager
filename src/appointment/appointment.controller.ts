import { Controller, Get, Body, UseGuards, Post, Param } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { GetUser } from 'src/auth/decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateAppointmentDto } from './dto';
@Controller('appointments')
export class AppointmentController {
  constructor(private AppointmentService: AppointmentService) {}
  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  GetAppointments(@GetUser('id') userId: number) {
    return this.AppointmentService.GetAppointments(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  GetAppointment(@Param('id') appointmentId: number) {
    return this.AppointmentService.GetAppointment(appointmentId);
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  AddAppointment(
    @GetUser('id') userId: number,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.AppointmentService.AddAppointment(userId, dto);
  }
}
