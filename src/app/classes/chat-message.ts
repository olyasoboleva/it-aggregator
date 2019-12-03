export class ChatMessage {
  sender: string;
  content: string;
  messageDate: Date;

  constructor(sender: string, content: string, date: Date) {
    this.sender = sender;
    this.content = content;
    this.messageDate = date;
  }
}
