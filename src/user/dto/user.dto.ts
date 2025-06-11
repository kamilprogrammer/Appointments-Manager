import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  role: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  gender: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  dateofBirth: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone2: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  domain: string;
}
export class EditDoctorDto extends EditUserDto {}
export class EditPatientDto extends EditUserDto {}
