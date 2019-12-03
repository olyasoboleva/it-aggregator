import {Component, Inject, OnInit} from '@angular/core';
import {AttendeeShort} from '../../classes/attendee-short';
import {ChatInfo} from '../../classes/chat-info';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChatService} from '../../_services/chat.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ChatMessage} from '../../classes/chat-message';
import {Attendee} from '../../classes/attendee';

@Component({
  selector: 'app-chat-creation',
  templateUrl: './chat-creation.component.html',
})
export class ChatCreationComponent implements OnInit {
  friends: AttendeeShort[];
  chat: ChatInfo;
  chatForm: FormGroup;
  interlocutors: string[];

  constructor(
    private chatService: ChatService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ChatCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    // request
    this.chat = new ChatInfo();
    this.friends = [{attendeeId: 'qwe', fullName: 'Иван Иванов'}, {attendeeId: 'rty', fullName: 'Петр Петров'},
      {attendeeId: 'uio', fullName: 'Леонардо Ди Каприо'}];
    this.chatForm = this.formBuilder.group({
      name: ['', Validators.required],
      // selection: ['', Validators.required],
      selection: [''],
      message: ['', Validators.required]
    });
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.chatForm.invalid) {
      return;
    }
    this.interlocutors = this.chatForm.get('selection').value;
    const message = this.chatForm.get('message').value;
    this.chat.name = this.chatForm.get('name').value;
    this.chat.attendeeList = []; this.chat.messageList = [];
    this.chat.messageList.push(new ChatMessage(this.data.currentAttendeeId, message, new Date()));
    let attendee = new Attendee();
    attendee.attendeeId = this.data.currentAttendeeId;
    this.chat.attendeeList.push(attendee);
    if (this.interlocutors.length > 0) {
      this.interlocutors.forEach(interlocutor => {
        attendee = new Attendee();
        attendee.attendeeId = interlocutor;
        this.chat.attendeeList.push(attendee);
      });
    }
    this.send(this.chat);
    this.dialogRef.close();
  }

  send(chat: ChatInfo) {
    console.log('create new chat');
    this.data.stompClient.send('/app/create/chat', {}, JSON.stringify(chat));
  }
}

export interface DialogData {
  currentAttendeeId: string;
  stompClient: any;
}
