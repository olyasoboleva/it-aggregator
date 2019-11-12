import {Component, OnInit} from '@angular/core';
import {UserService} from '../_services/user.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit() {
  }

  onClick() {
    this.userService.testkek()
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

}
