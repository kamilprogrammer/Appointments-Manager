import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuditLogDto {
  @IsNotEmpty()
  @IsString()
  entity: string;

  @IsNotEmpty()
  @IsNumber()
  entityId: number;

  @IsNotEmpty()
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VERIFY' | 'RESCHEDULE';

  @IsNotEmpty()
  changes: any;

  @IsNotEmpty()
  @IsNumber()
  userId?: number;
}
