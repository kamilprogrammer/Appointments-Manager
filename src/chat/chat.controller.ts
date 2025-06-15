import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateChatDto } from './dto';
import { ChatService } from './chat.service';
import { GetUser } from 'src/auth/decorator';

@Controller('chats')
export class chatController {
  constructor(private chatService: ChatService) {}
  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  async addChat(@Body() dto: CreateChatDto) {
    return this.chatService.addChat(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getChatsRelated(@GetUser('id') userId: number) {
    return this.chatService.getChatsRelated(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getChat(@GetUser('id') userId: number, @Param('id') chatId: number) {
    console.log('getting chat');
    return this.chatService.getChat(userId, chatId);
  }

  // This Endpoint is for deleting a *message*
  @HttpCode(204)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteMsg(@GetUser('id') userId: number, @Param('id') msgId: number) {
    return this.chatService.deleteMsg(userId, msgId);
  }
}
