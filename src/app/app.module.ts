import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {appRoutingModule} from './app.routing';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {NoopAnimationsModule, BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule,
  MatInputModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSlideToggleModule, MatStepperModule
} from '@angular/material';
import {HeaderComponent} from './components/header/header.component';
import {EventListComponent} from './components/event-list/event-list.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {EventDetailsComponent, ParticipantListComponent} from './components/event-details/event-details.component';
import 'hammerjs';
import {OrganizationProfileComponent} from './components/organization-profile/organization-profile.component';
import {AttendeeProfileComponent} from './components/attendee-profile/attendee-profile.component';
import {EventCreationComponent} from './components/event-creation/event-creation.component';
import {ChatListComponent} from './components/chat-list/chat-list.component';
import {ChatComponent} from './components/chat/chat.component';
import {ChatCreationComponent} from './components/chat-creation/chat-creation.component';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {DialogCreationComponent} from './components/dialog-creation/dialog-creation.component';
import {AvatarModule} from 'ngx-avatar';

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
    ParticipantListComponent,
    EventCreationComponent,
    ChatListComponent,
    ChatComponent,
    ChatCreationComponent,
    DialogCreationComponent,
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
    MatSlideToggleModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    AvatarModule
  ],
  entryComponents: [
    ParticipantListComponent,
    ChatCreationComponent,
    DialogCreationComponent
  ],
  providers: [
    MatDatepickerModule,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
