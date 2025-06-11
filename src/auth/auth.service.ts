import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  /*
  for better performance and efficent code I goota as ( Kamel Rifai ) have a role(string) in the 
  dto so a p or d or PATIENT or a DOCTOR that is a better solution to avoid future problems*/

  // Full SignUp Functionality
  async SignUp(dto: AuthDto) {
    try {
      // Creating the User in users table
      const hash = (await argon.hash(dto.password)).toString();

      const user = await this.prisma.user.create({
        data: { email: dto.email, password: hash },
        select: { id: true, email: true },
      });
      // If user is a Doctor
      if (dto.doctor) {
        await this.prisma.doctor.create({
          data: {
            firstname: dto.firstname,
            lastname: dto.lastname,
            phone: dto.phone,
            phone2: dto.phone2,
            domain: dto.domain,
            gender: dto.gender,
            userId: user.id,
          },
        });
        // If User is a Patient
      } else if (dto.patient) {
        await this.prisma.patient.create({
          data: {
            firstname: dto.firstname,
            lastname: dto.lastname,
            phone: dto.phone,
            gender: dto.gender,
            userId: user.id,
          },
        });
      }
      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code == 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
    }
  }
  // Full SignIn Functionality
  async SiginIn(dto: AuthDto) {
    // Finding The User By Email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        doctor: true,
        patient: true,
      },
    });

    // If User is Not Found
    if (!user) {
      throw new ForbiddenException('Wrong Credentials');
    }

    // Go on With Logic ( Comparing passwords )
    const compareWs = await argon.verify(user.password, dto.password);
    if (!compareWs) {
      throw new ForbiddenException('Password is Wrong');
    }
    // Signign Token For JWT Auth

    return this.signToken(user.id, user.email);
  }
  async signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: this.config.get('SECRET_CODE'),
    });
    return { accesstoken: token };
  }
}
