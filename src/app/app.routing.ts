import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import {AuthGuard} from './_helpers/auth.guard';
import {EventListComponent} from './components/event-list/event-list.component';
import {EventDetailsComponent} from './components/event-details/event-details.component';
import {OrganizationProfileComponent} from './components/organization-profile/organization-profile.component';
import {AttendeeProfileComponent} from './components/attendee-profile/attendee-profile.component';
import {EventCreationComponent} from './components/event-creation/event-creation.component';
import {ChatListComponent} from './components/chat-list/chat-list.component';
import {ChatComponent} from './components/chat/chat.component';

const routes: Routes = [
  { path: 'attendee-profile', component: AttendeeProfileComponent, canActivate: [AuthGuard] },
  { path: 'organization-profile', component: OrganizationProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'event-list', component: EventListComponent },
  { path: 'event/:id', component: EventDetailsComponent},
  { path: 'create-event', component: EventCreationComponent},
  { path: 'chat-list', component: ChatListComponent},
  { path: 'chat/:id', component: ChatComponent},

  // otherwise redirect to home
  { path: '**', redirectTo: 'event-list' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
