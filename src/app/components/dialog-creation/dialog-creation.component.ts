import {Component, Inject, OnInit} from '@angular/core';
import {ChatInfo} from '../../classes/chat-info';
import {ChatService} from '../../_services/chat.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ChatMessage} from '../../classes/chat-message';
import {Attendee} from '../../classes/attendee';
import {AttendeeService} from '../../_services/attendee.service';
import {ChatShort} from '../../classes/chat-short';
import {environment} from '../../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


@Component({
  selector: 'app-dialog-creation',
  templateUrl: './dialog-creation.component.html',
  styleUrls: ['./dialog-creation.component.css']
})
export class DialogCreationComponent implements OnInit {
  existingChat: ChatShort;
  currentAttendeeId: string;
  isExisting: boolean;
  chatName: string;
  content: string;
  stompClient: any;

  constructor(
    private chatService: ChatService,
    private attendeeService: AttendeeService,
    public dialogRef: MatDialogRef<DialogCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.attendeeService.getAttId().subscribe( data => {
      this.currentAttendeeId = data.substr(1, data.length - 2);
    });
    this.chatService.checkChat(this.data.receiverId).subscribe( (data: ChatShort) => {
      if (data !== null) {
        this.existingChat = data;
        this.isExisting = true;
        this.chatName = this.existingChat.name;
      } else {
        this.isExisting = false;
      }
    });
    this.connect();
  }

  onNoClick(): void {
    this.disconnect();
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.content === undefined || this.chatName === undefined) {
      return;
    }
    const message = new ChatMessage(this.currentAttendeeId, this.content, new Date());
    if (this.isExisting) {
      message.chatId.chatId = this.existingChat.chatId;
      this.sendMessage(message);
    } else {
      const chat = new ChatInfo();
      chat.name = this.chatName;
      chat.attendeeList = []; chat.messageList = [];
      chat.messageList.push(message);
      const sender = new Attendee();
      sender.attendeeId = this.currentAttendeeId;
      chat.attendeeList.push(sender);
      const receiver = new Attendee();
      receiver.attendeeId = this.data.receiverId;
      chat.attendeeList.push(receiver);
      this.sendChat(chat);
    }
    this.dialogRef.close();
  }

  // websocket
  connect() {
    console.log('Initialize WebSocket Connection');
    const ws = new SockJS(`${environment.API_URL}/ws`);
    this.stompClient = Stomp.over(ws);
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  sendChat(chat: ChatInfo) {
    console.log('create new chat');
    this.stompClient.send('/app/create/chat', {}, JSON.stringify(chat));
  }

  sendMessage(message: ChatMessage) {
    console.log('send message');
    this.stompClient.send('/app/send/message', {}, JSON.stringify(message));
  }
}
