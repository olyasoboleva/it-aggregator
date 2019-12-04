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
  private chat: ChatInfo;
  today: Date;
  stompClient: any;
  messageContent: string;
  currentAttendeeId: string;

  constructor(
    private chatService: ChatService,
    private attendeeService: AttendeeService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // 8ce8b671-a0af-426f-906e-2e411d446d09
    this.chat = new ChatInfo(); this.chat.messageList = [];
    let message;
    this.route.paramMap.subscribe(params => {
      this.chatService.getLastMessages(params.get('id')).subscribe( (data: any[]) => {
        data.forEach(mes => {
          this.chat.chatId = mes.chatId.chatId;
          this.chat.name = mes.chatId.name;
          message = new ChatMessage(mes.sender, mes.content, mes.messageDate);
          this.chat.messageList.push(message);
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
    if (this.stompClient !== null) {
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
    this.chat.messageList.push(mes);
  }

  send() {
    if (this.messageContent === '') {
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
