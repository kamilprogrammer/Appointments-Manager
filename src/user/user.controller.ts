import { Controller, Get, UseGuards, Patch, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { User } from 'generated/prisma';

@Controller('users')
export class UserController {
  constructor(private UserService: UserService) {}
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@GetUser() user: User) {
    return user;
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('/me/edit')
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.UserService.editUser(userId, dto);
  }
}
