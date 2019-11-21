import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ItEvent} from '../classes/it-event';

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) { }

  getAllEvents() {
    return this.http.get(`${environment.API_URL}/event/get/all/event`);
  }

  getEvent(id: string) {
    return this.http.get<ItEvent>(`${environment.API_URL}/event/get/event/`.concat(id));
  }

  eventTypeTr(engType: string): string {
    switch (engType) {
      case 'Hackathon': return 'Хакатон';
      case 'Olympiad': return 'Олимпиада';
      case 'Lecture': return 'Лекция';
      case 'Conference': return 'Конференция';
    }
  }
}
