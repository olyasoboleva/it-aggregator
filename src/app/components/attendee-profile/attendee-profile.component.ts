import {Component, OnInit} from '@angular/core';
import {UserService} from '../../_services/user.service';
import {first} from 'rxjs/operators';
import {Attendee} from '../../classes/attendee';

@Component({
  selector: 'app-profile',
  templateUrl: './attendee-profile.component.html',
  styleUrls: ['./attendee-profile.component.css']
})
export class AttendeeProfileComponent implements OnInit {
  fileName: string;
  attendee: Attendee;

  constructor() {
  }

  ngOnInit() {
  }

  onFileChanged(event) {
    if (event.target.files[0].type.match(/image\/*/) == null) {
      return;
    }
    this.fileName = event.target.files[0].name;
    this.attendee.image = event.target.files[0];
  }

}
