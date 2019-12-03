import {ChatMessage} from './chat-message';
import {Attendee} from './attendee';

export class ChatInfo {
  chatId: string;
  name: string;
  attendeeList: Attendee[];
  messageList: ChatMessage[];
}
