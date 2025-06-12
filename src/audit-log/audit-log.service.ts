/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuditLogDto } from './dto';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}
  async AddLog(dto: AuditLogDto) {
    const log = await this.prisma.auditLog.create({
      data: {
        entity: 'Appointment',
        entityId: dto.entityId,
        action: dto.action,
        userId: dto.userId!,
        changes: dto.changes,
      },
    });
    return log;
  }
}
