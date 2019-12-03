import {User} from './user';

export class Attendee {

  user: User;
  attendeeId: string;
  name: string;
  surname: string;
  email: string;
  skills: string;
  image: string;

  setFields(json: any) {
    this.attendeeId = json.attendeeId;
    this.name = json.name;
    this.surname = json.surname;
    this.email = json.email;
    this.skills = json.skills;
  }
}
