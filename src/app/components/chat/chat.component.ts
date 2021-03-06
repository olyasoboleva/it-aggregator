import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from '../../_services/chat.service';
import {ActivatedRoute} from '@angular/router';
import {ChatMessage} from '../../classes/chat-message';
import {ChatInfo} from '../../classes/chat-info';
import {environment} from '../../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {AttendeeService} from '../../_services/attendee.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  chat: ChatInfo;
  today: Date;
  stompClient: any;
  messageContent: string;
  currentAttendeeId: string;
  avatars: Map<string, Avatar>;

  constructor(
    private chatService: ChatService,
    private attendeeService: AttendeeService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.chat = new ChatInfo(); this.chat.messageList = [];
    let message;
    this.avatars = new Map<string, Avatar>();
    this.route.paramMap.subscribe(params => {
      this.chatService.getLastMessages(params.get('id')).subscribe( (data: any[]) => {
        data.forEach(mes => {
          this.chat.chatId = mes.chatId.chatId;
          this.chat.name = mes.chatId.name;
          message = new ChatMessage(mes.sender, mes.content, mes.messageDate);
          this.chat.messageList.push(message);
          this.addAvatar(mes.sender);
        });
        this.chat.messageList.sort((mes1, mes2) => new Date(mes1.messageDate).getTime() - new Date(mes2.messageDate).getTime());
        this.connect();
      });
    });
    this.attendeeService.getAttId().subscribe( data => {
      this.currentAttendeeId = data.substr(1, data.length - 2);
    });

    this.today = new Date(); this.today.setHours(0, 0, 0, 0);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  // websocket
  connect() {
    console.log('Initialize WebSocket Connection');
    const ws = new SockJS(`${environment.API_URL}/ws`);
    this.stompClient = Stomp.over(ws);
    const that = this;
    that.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/topic/chat/'.concat(that.chat.chatId), function (sdkEvent) {
        that.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  }

  disconnect() {
    if (this.stompClient !== undefined) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  onMessageReceived(message) {
    console.log('Message Recieved from Server :: ' + message.body);
    const m = JSON.parse(message.body);
    const mes = new ChatMessage(m.sender, m.content, new Date(m.messageDate));
    this.addAvatar(m.sender);
    this.chat.messageList.push(mes);
  }

  addAvatar(fullName: string) {
    const ava = new Avatar();
    if (!this.avatars.has(fullName)) {
      const space = fullName.indexOf(' ');
      ava.initials = fullName.charAt(0) + fullName.charAt(space + 1);
      ava.color = ava.getRandomColor();
      this.avatars.set(fullName, ava);
    }
  }

  send() {
    if (this.messageContent === undefined) {
      return;
    }
    const message = new ChatMessage(this.currentAttendeeId, this.messageContent, new Date());
    message.chatId.chatId = this.chat.chatId;
    console.log('send message');
    this.stompClient.send('/app/send/message', {}, JSON.stringify(message));
    this.messageContent = '';
  }

  pressEnter(event) {
    if (event.ctrlKey && event.key === 'Enter') {
      this.messageContent += '\n';
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.send();
    }
  }
}

class Avatar {
  initials: string;
  color: string;

  getRandomColor(): string {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + color;
  }
}
