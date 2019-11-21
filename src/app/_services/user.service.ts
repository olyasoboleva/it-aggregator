import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Attendee} from '../classes/attendee';
import {Organization} from '../classes/organization';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  signup(request, path) {
    return this.http.post(`${environment.API_URL}`.concat(path), request);
  }

  orgProfile(id: string) {
    return this.http.get<Organization>(`${environment.API_URL}/event/organization/`.concat(id));
  }
}
