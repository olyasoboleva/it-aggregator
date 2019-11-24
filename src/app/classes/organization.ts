import {User} from './user';

export class Organization {
  user: User;
  id: string;
  name: string;
  phone: string;
  email: string;
  info: string;
  image: string;

  setFields(json: any) {
    this.id = json.organizationId;
    this.name = json.name;
    this.email = json.email;
    this.phone = json.phone;
    this.info = json.info;
  }
}
