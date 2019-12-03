import {Component, Inject, OnInit} from '@angular/core';
import {ChatInfo} from '../../classes/chat-info';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {AttendeeService} from '../../_services/attendee.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {ChatCreationComponent} from '../chat-creation/chat-creation.component';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  chats: ChatInfo[];
  today: Date;
  currentAttendeeId: string;
  stompClient: any;

  constructor(public dialog: MatDialog,
    private attendeeService: AttendeeService) { }

  ngOnInit() {
    this.attendeeService.getAttId().subscribe( data => {
      this.currentAttendeeId = data.substr(1, data.length - 2);
      // ws connection
      this.connect();
    });
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
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

  onMessageReceived(message) {
    console.log('Message Recieved from Server :: ' + message);
    // some actions
  }

}
