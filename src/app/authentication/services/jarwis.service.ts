import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JarwisService {

  constructor(private http : HttpClient) { }

  signup(data: any) {
    return this.http.post(`${environment.baseUrl}/register` , data,)
  }

  signupCorp(data: any) {
    return this.http.post(`${environment.baseUrl}/register` , data)
  }

  login(data: any) {
    return this.http.post(`${environment.baseUrl}/customer-login` , data)
  }

  validateAccountDetails(data: any) {
    return this.http.post(`${environment.baseUrl}/registration/validate-account` , data)
  }

}
