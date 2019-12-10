import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthenticationService} from '../_services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  currentUser: any;
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        if (this.currentUser !== null) {
          this.authenticationService.logout();
          location.reload(true);
        }
      }
      return throwError(err);
    }));
  }
}
