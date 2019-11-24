import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { appRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule, MatCheckboxModule, MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule, MatSelectModule, MatSlideToggleModule,
  MatStepperModule
} from '@angular/material';
import { HeaderComponent } from './components/header/header.component';
import { EventListComponent } from './components/event-list/event-list.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import 'hammerjs';
import { OrganizationProfileComponent } from './components/organization-profile/organization-profile.component';
import { AttendeeProfileComponent } from './components/attendee-profile/attendee-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    EventListComponent,
    EventDetailsComponent,
    OrganizationProfileComponent,
    AttendeeProfileComponent,
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
    MatRadioModule,
    FlexLayoutModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    MatSlideToggleModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
