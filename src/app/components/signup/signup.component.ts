import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../_services/authentication.service';
import {MyErrorStateMatcher} from '../../_helpers/errors.state.matcher';
import {UserService} from '../../_services/user.service';
import {User} from '../../classes/user';
import {Attendee} from '../../classes/attendee';
import {Organization} from '../../classes/organization';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  currentUser: any;
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
  fileName: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    this.fileName = 'Изображение не выбрано';
    // redirect to home if already logged in
    if (this.currentUser) {
      this.router.navigate(['/']);
    }
    this.orgForm = this.formBuilder.group({
      orgName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      info: ['']
    });

    this.attForm = this.formBuilder.group({
      surname: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      skills: ['']
    });

    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['']
    }, {validator: this.checkPasswords});
  }

  checkPasswords(group: FormGroup) {
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
      this.attendee.skills = this.attForm.get('skills').value;
    } else {
      if (this.orgForm.invalid) {
        return;
      }
      this.organization.name = this.orgForm.get('orgName').value;
      this.organization.phone = this.orgForm.get('phone').value;
      this.organization.email = this.orgForm.get('email').value;
      this.organization.info = this.orgForm.get('info').value;
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
          this.router.navigate(['/login']);
        },
        error => {
          if (error.error === 'User already exists') {
            this.error = 'Пользователь с такими логином уже существует';
          } else {
            this.error = 'Ошибка сервера!';
          }
        });
  }
}
