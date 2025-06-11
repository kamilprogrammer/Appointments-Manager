import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsDate()
  @Type(() => Date)
  date: Date;
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
  @IsOptional()
  @IsString()
  status: string;
  @IsBoolean()
  verified: boolean;
  @IsNumber()
  patientId: number;
  @IsNumber()
  doctorId: number;
}
export class EditAppointmentDto extends CreateAppointmentDto {}
