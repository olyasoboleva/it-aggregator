import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ChatShort} from '../classes/chat-short';

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

  checkChat(receiverId: string) {
    const params = new HttpParams().set('receiverId', receiverId);
    return this.http.get<ChatShort>(`${environment.API_URL}/chat/chat/check`, {params});
  }
}
