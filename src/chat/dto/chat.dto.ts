import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsOptional()
  @IsString()
  sessionId?: string;
  @IsNumber()
  patientId: number;
  @IsNumber()
  doctorId: number;
}
