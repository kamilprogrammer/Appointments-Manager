import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsOptional()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
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
  @IsOptional()
  @IsBoolean()
  verified: boolean;
  @IsOptional()
  @IsNumber()
  patientId: number;
  @IsOptional()
  @IsNumber()
  doctorId: number;
}
