import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Organization} from '../classes/organization';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  constructor(private http: HttpClient) { }

  orgProfile(id: string) {
    return this.http.get<Organization>(`${environment.API_URL}/event/organization/`.concat(id));
  }

  updateOrganization(org: Organization) {
    return this.http.patch<Organization>(`${environment.API_URL}/update/organization`, org);
  }
}
