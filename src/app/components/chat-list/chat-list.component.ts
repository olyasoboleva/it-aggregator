import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {AttendeeService} from '../../_services/attendee.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {ChatCreationComponent} from '../chat-creation/chat-creation.component';
import {environment} from '../../../environments/environment';
import {ChatService} from '../../_services/chat.service';
import {ChatMessage} from '../../classes/chat-message';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy {
  chatMessages: Map<string, ChatMessage>;
  chatMessagesValues: ChatMessage[];
  today: Date;
  currentAttendeeId: string;
  stompClient: any;

  constructor(public dialog: MatDialog,
    private chatService: ChatService,
    private attendeeService: AttendeeService) { }

  ngOnInit(): void {
    this.chatMessages = new Map<string, ChatMessage>();
    let message;
    this.attendeeService.getAttId().subscribe( data => {
      this.currentAttendeeId = data.substr(1, data.length - 2);
      this.chatService.getAllChats().subscribe(( messages: ChatMessage[]) => {
        messages.forEach(mes => {
          message = this.getNewMessage(mes);
          this.chatMessages.set(message.chatId.chatId, message);
        });
        this.sortByDate();
        this.connect();
      });
    });
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  createChat(): void {
    const dialogRef = this.dialog.open(ChatCreationComponent, {
      width: '300px',
      height: '400px',
      data: {currentAttendeeId: this.currentAttendeeId, stompClient: this.stompClient}
    });
  }

  // websocket
  connect() {
    console.log('Initialize WebSocket Connection');
    const ws = new SockJS(`${environment.API_URL}/ws`);
    this.stompClient = Stomp.over(ws);
    const that = this;
    that.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/queue/chats/'.concat(that.currentAttendeeId), function (sdkEvent) {
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

  onMessageReceived(message): void {
    console.log('Message Recieved from Server :: ' + message);
    const mes = JSON.parse(message.body);
    const newMessage = this.getNewMessage(mes);
    this.chatMessages.set(newMessage.chatId.chatId, newMessage);
    this.sortByDate();
  }

  getNewMessage(mes: any): ChatMessage {
    const newMessage = new ChatMessage(mes.sender, mes.content, new Date(mes.messageDate));
      newMessage.chatId = mes.chatId;
    return newMessage;
  }

  sortByDate(): void {
    this.chatMessagesValues = Array.from(this.chatMessages.values()).sort((m1, m2) => {
      return new Date(m2.messageDate).getTime() - new Date(m1.messageDate).getTime();
    });
  }
}
