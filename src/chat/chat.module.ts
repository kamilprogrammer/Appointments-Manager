import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { chatController } from './chat.controller';
import { ChatService } from './chat.service';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_CODE || '#1Appoitment_Software1#',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [chatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
