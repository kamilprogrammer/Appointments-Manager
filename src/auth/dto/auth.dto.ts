import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  doctor: boolean;

  @IsBoolean()
  @IsOptional()
  patient: boolean;

  @IsOptional()
  phone: string;

  @IsOptional()
  phone2: string;

  @IsOptional()
  @IsString()
  firstname: string;

  @IsOptional()
  @IsString()
  lastname: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  gender: string;
}
