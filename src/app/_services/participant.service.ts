import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Participant} from '../classes/participant';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  constructor(private http: HttpClient) { }

  getStatus(eventId: string) {
    const params = new HttpParams()
      .set('eventId', eventId);
    return this.http.get(`${environment.API_URL}/event/participant/status`, {params});
  }

  updateStatus(participant: Participant) {
    return this.http.patch(`${environment.API_URL}/event/update/participant`, participant);
  }

  deleteStatus(eventId: string) {
    const params = new HttpParams()
      .set('eventId', eventId);
    return this.http.delete(`${environment.API_URL}/event/delete/participant`, {params});
  }
}
