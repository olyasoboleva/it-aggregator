import { Component, OnInit } from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {MyErrorStateMatcher} from '../_helpers/errors.state.matcher';
import {UserService} from '../_services/user.service';
import {User} from '../classes/user';
import {Attendee} from '../classes/attendee';
import {Organization} from '../classes/organization';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  orgForm: FormGroup;
  attForm: FormGroup;
  authForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  hide = true;
  isAttendee = true;
  error: string;
  user = new User();
  attendee = new Attendee();
  organization = new Organization();

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
      }
  }

  ngOnInit() {
    this.orgForm = this.formBuilder.group({
      orgName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      details: ['']
    });

    this.attForm = this.formBuilder.group({
      surname: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      info: ['']
    });

    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['']
    }, {validator: this.checkPasswords});
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    if (confirmPass.length === 0 || pass.length === 0) { return null; }

    return pass === confirmPass ? null : { notSame: true };
  }

  onClick() {
    if (this.isAttendee) {
      if (this.attForm.invalid) {
        return;
      }
      this.attendee.name = this.attForm.get('name').value;
      this.attendee.surname = this.attForm.get('surname').value;
      this.attendee.email = this.attForm.get('email').value;
      this.attendee.info = this.attForm.get('info').value;
    } else {
      if (this.orgForm.invalid) {
        return;
      }
      this.organization.name = this.orgForm.get('orgName').value;
      this.organization.phone = this.orgForm.get('phone').value;
      this.organization.email = this.orgForm.get('email').value;
      this.organization.details = this.orgForm.get('details').value;
    }
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }
    this.user.username = this.authForm.get('username').value;
    this.user.password = this.authForm.get('password').value;
    this.user.attendee = this.isAttendee;
    if (this.isAttendee) { this.attendee.user = this.user; } else { this.organization.user = this.user; }
    const request = this.isAttendee ? this.attendee : this.organization;
    this.userService.signup(request, this.isAttendee ? '/auth/signup/attendee' : '/auth/signup/organization')
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/login'], { queryParams: { registered: true }});
        },
        error => {
          if (error.error === 'User already exists') {
            this.error = 'Пользователь с такими логином уже существует';
          } else {
            this.error = error.error;
          }
        });
  }

}
