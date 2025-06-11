import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import * as argon from 'argon2';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async editUser(userId: number, dto: EditUserDto) {
    try {
      dto.password = await argon.hash(dto.password);

      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { password: dto.password },
        include: { doctor: true, patient: true },
      });

      if (user.doctor) {
        return this.editDoctor(userId, dto);
      } else if (user.patient) {
        return this.editPatient(userId, dto);
      }
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Failed to edit the values.');
      }
      throw err;
    }
  }
  async editDoctor(userId: number, dto: EditUserDto) {
    const doctor = await this.prisma.doctor.update({
      where: { userId: userId },
      data: {
        address: dto.address,
        firstname: dto.firstname,
        lastname: dto.lastname,
        domain: dto.domain,
        dateofBirth: dto.dateofBirth,
        gender: dto.gender,
        phone: dto.phone,
        phone2: dto.phone2,
      },
    });
    return doctor;
  }

  async editPatient(userId: number, dto: EditUserDto) {
    const patient = await this.prisma.patient.update({
      where: { userId: userId },
      data: {
        address: dto.address,
        firstname: dto.firstname,
        lastname: dto.lastname,
        dateOfBirth: dto.dateofBirth,
        gender: dto.gender,
        phone: dto.phone,
      },
    });
    return patient;
  }
}
