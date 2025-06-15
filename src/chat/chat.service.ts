import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto';
import { SendMessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  async addChat(dto: CreateChatDto) {
    try {
      const chat = await this.prisma.chat.findFirst({
        where: { doctorId: dto.doctorId, patientId: dto.patientId },
        include: { messages: { orderBy: { id: 'asc' } } },
      });
      if (!chat) {
        const sessionId = crypto.randomUUID();
        return await this.prisma.chat.create({
          data: {
            doctorId: dto.doctorId,
            patientId: dto.patientId,
            sessionId: sessionId,
          },
        });
      } else {
        return chat;
      }
    } catch (err) {
      console.log(err);
      throw new ForbiddenException(`Duplicated Chat IDs.`);
    }
  }
  async sendMessage(dto: SendMessageDto) {
    console.log(dto);
    const chat = await this.prisma.chat.findUnique({
      where: { id: dto.chatId },
    });
    if (chat?.sessionId !== dto.chatSessionId) {
      throw new ForbiddenException('The Chat session and ID are Not Match.');
    }

    const message = await this.prisma.message.create({
      data: {
        chatId: dto.chatSessionId,
        content: dto.content,
        senderId: dto.senderId,
      },
      omit: {
        updatedAt: true,
        senderId: true,
      },
    });
    return message;
  }
  async getChat(userId: number, chatId: number) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: { id: chatId },
        include: { messages: true },
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      });

      const person = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { doctor: true, patient: true },
      });

      if (
        chat &&
        (chat.doctorId == person?.doctor?.id ||
          chat?.patientId == person?.patient?.id)
      ) {
        console.log(chat);
        return chat;
      } else {
        throw new ForbiddenException(
          'You are not Authorized to get this chat.',
        );
      }
    } catch (err) {
      console.log(err);
      throw new ForbiddenException('You are not Authorized to get this chat.');
    }
  }
  async getChatsRelated(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { doctor: true, patient: true },
    });
    if (user?.doctor) {
      return await this.prisma.chat.findMany({
        where: { doctorId: user?.doctor.id },
        orderBy: { updatedAt: 'desc' },
      });
    }
    if (user?.patient) {
      return await this.prisma.chat.findMany({
        where: { patientId: user?.patient.id },
      });
    }
  }
}
