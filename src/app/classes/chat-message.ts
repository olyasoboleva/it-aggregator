import {ChatShort} from './chat-short';

export class ChatMessage {
  sender: string;
  content: string;
  messageDate: Date;
  chatId: ChatShort;

  constructor(sender: string, content: string, date: Date) {
    this.sender = sender;
    this.content = content;
    this.messageDate = date;
    this.chatId = new ChatShort();
  }
}
