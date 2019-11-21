import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  signup(request, path) {
    return this.http.post(`${environment.API_URL}`.concat(path), request);
  }
}
