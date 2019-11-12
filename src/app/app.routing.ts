import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import {AuthGuard} from './_helpers/auth.guard';
import {EventListComponent} from './event-list/event-list.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'event-list', component: EventListComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: 'event-list' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
