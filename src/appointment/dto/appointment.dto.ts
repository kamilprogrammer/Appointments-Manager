import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
export class CreateAppointmentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  status: string;

  @IsBoolean()
  verified: boolean;

  @IsNumber()
  patientId: number;

  @IsNumber()
  doctorId: number;
}
export class EditAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsOptional()
  status: string;

  @IsBoolean()
  @IsOptional()
  verified: boolean;

  @IsNumber()
  @IsOptional()
  patientId: number;

  @IsNumber()
  @IsOptional()
  doctorId: number;
}
