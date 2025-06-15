import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  content: string;
  senderId: number;
  chatId: number;
  @IsString()
  chatSessionId: string;
}
