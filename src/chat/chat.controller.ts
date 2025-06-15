import { Controller, UseGuards, Post, Body, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateChatDto } from './dto';
import { ChatService } from './chat.service';
import { GetUser } from 'src/auth/decorator';

@Controller('chat')
export class chatController {
  constructor(private chatService: ChatService) {}
  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  async addChat(@Body() dto: CreateChatDto) {
    console.log(dto);
    return this.chatService.addChat(dto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getChat(@GetUser('id') userId: number, @Param('id') chatId: number) {
    return this.chatService.getChat(userId, chatId);
  }
}
