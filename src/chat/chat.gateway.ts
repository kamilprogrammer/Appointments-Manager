/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageBody } from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';

@WebSocketGateway(80, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwt: JwtService,
    private chatService: ChatService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  GetUserId(token: string | undefined) {
    if (token) {
      token = token.replace('Bearer', '').trim();
      return this.jwt.verify(token, this.config.get('SECRET_CODE')).sub;
    }
  }

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization
      ?.replace('Bearer', '')
      .trim();
    if (token) {
      try {
        const payload = this.jwt.verify(token, this.config.get('SECRET_CODE'));
        console.log(payload);
        client.data.user = payload;
        console.log('Client connected:', client.id);
      } catch (err) {
        console.log(err);
      }
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      chatSessionId: string;
      content: string;
      chatId: number;
      senderId: number;
    },
  ) {
    await this.chatService.sendMessage({
      senderId: data.senderId,
      content: data.content,
      chatSessionId: data.chatSessionId,
      chatId: data.chatId,
    });
    console.log(data.content);
    client.to(data.chatSessionId).emit('new_message', data);
  }

  @SubscribeMessage('join_chat')
  handleJoinChat(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(data.sessionId);
    console.log('join_chat');
    client.join(data.sessionId);

    this.server
      .to(data.sessionId)
      .emit('some_event', { message: 'User joined' });
  }
}
