import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Attendee} from '../classes/attendee';

@Injectable({ providedIn: 'root' })
export class AttendeeService {
  constructor(private http: HttpClient) { }

  getAtt(id: string) {
    return this.http.get<Attendee>(`${environment.API_URL}/chat/attendee/`.concat(id));
  }

  attProfile() {
    return this.http.get<Attendee>(`${environment.API_URL}/chat/attendee/profile`);
  }

  updateAttendee(att: Attendee) {
    return this.http.patch(`${environment.API_URL}/chat/update/attendee`, att);
  }

  getAttId() {
    return this.http.get(`${environment.API_URL}/chat/attendee/id`, {responseType: 'text'});
  }

  getAttendeeByUserId(userId) {
    return this.http.get(`${environment.API_URL}/chat/attendee/from_user/`.concat(userId));
  }
}
