import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { appRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule, MatStepperModule} from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { EventListComponent } from './event-list/event-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    HeaderComponent,
    EventListComponent,
  ],
  imports: [
    BrowserModule,
    appRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NoopAnimationsModule,
    MatIconModule,
    MatRadioModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }