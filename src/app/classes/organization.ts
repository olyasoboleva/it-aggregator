import {User} from './user';

export class Organization {
  user: User;
  id: string;
  name: string;
  phone: string;
  email: string;
  details: string;
  image: Blob;
}
