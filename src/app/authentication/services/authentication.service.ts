import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
// import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loggedIn = new BehaviorSubject<boolean>(this.Token.loggedIn());
  authStatus = this.loggedIn.asObservable();

  token: any;

  constructor(private Token:TokenService, private http: HttpClient) {

  }

  changeAuthStatus(value : boolean) {
    this.loggedIn.next(value);
  }

  loggedInUser() {
    return sessionStorage.getItem('token');
  }

  // getSessionData(){
  //   const getToken: any = sessionStorage.getItem('token');
  //   const getRandomNo: any = sessionStorage.getItem('random');
  //   this.token = CryptoJS.AES.decrypt( getToken , getRandomNo).toString(CryptoJS.enc.Utf8)
  // }

  twoFactor(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/customer-login-with-mfa`, payload, {headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  verifyOtp(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/customer-verify-otp`, payload, {headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  confirmEmail(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/confirm-email`, payload, {headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  // adLogin(payload: any){
  //   return this.http.post<any>(`${environment.adLogin}/adloginv3`, payload);
  // }

  getResetPasswordToken(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/customer-generate-password-reset-token`, payload, {headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  resetPassword(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/customer-reset-password`, payload, {headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

}
