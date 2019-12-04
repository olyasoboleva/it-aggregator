import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) { }

  createChat() {
    return this.http.get(`${environment.API_URL}/chat/attendee/profile`);
  }

  getUserCompany() {
    return this.http.get(`${environment.API_URL}/chat/attendee/company`);
  }

  getLastMessages(chatId: string) {
    return this.http.get(`${environment.API_URL}/chat/message/`.concat(chatId));
  }

  getAllChats() {
    return this.http.get(`${environment.API_URL}/chat/attendees/chats`);
  }
}
