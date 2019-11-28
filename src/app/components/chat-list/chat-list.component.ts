import {Component, OnInit} from '@angular/core';
import {ChatInfo} from '../../classes/chat-info';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Attendee} from '../../classes/attendee';
import {AttendeeShort} from '../../classes/attendee-short';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  chats: ChatInfo[];
  today: Date;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.chats = [{name: 'kek', chatId: 'qwe', lastMessage: {sender: 'Оля Соболева',
        content: 'Ср(о|а)ки горят', messageDate: new Date(2018, 11, 30, 10, 0, 0, 0)}},
      {name: 'lol', chatId: 'rty', lastMessage: {sender: 'Оля Соболева',
          content: 'Памагити', messageDate: new Date(2018, 11, 30, 10, 0, 0, 0)}}];
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
  }

  createChat(): void {
    const dialogRef = this.dialog.open(ChatCreationComponent, {
      width: '300px',
      height: '400px'
    });
  }
}

@Component({
  selector: 'app-chat-creation',
  templateUrl: './chat-creation.component.html',
})
export class ChatCreationComponent implements OnInit {
  friends: AttendeeShort[];
  message: string;

  constructor(
    public dialogRef: MatDialogRef<ChatCreationComponent>
  ) {
  }

  ngOnInit(): void {
    // request
    this.friends = [{attendeeId: 'qwe', fullName: 'Иван Иванов'}, {attendeeId: 'rty', fullName: 'Петр Петров'},
      {attendeeId: 'uio', fullName: 'Леонардо Ди Каприо'}];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // request
  }
}
