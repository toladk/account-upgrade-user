import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private notification: NzNotificationService
  ) {}

  canActivate(): boolean {
    if ( this.auth.loggedInUser() ) {
      return true
    } else {
      this.router.navigate(['/login'])
      this.notification.error( 'Session', 'You need to login !!' );
      return false
    }
  }

}
