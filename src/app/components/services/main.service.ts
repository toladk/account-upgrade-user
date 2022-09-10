import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    private http: HttpClient
  ) { }

  getAccountDetails(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/get-accounts-with-customer-id`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  getDocument(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/get-documents-with-account-number`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  uploadDocument(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/upload-batch-documents`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  enable2factor(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/customer-enable-mfa`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  updateDocument(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/update-document`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  getDocumentType(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/get-required-documents`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  changePassword(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/customer-change-password`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  getAllDirectors(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/corporate/get-directors-with-customerId`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  addDirector(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/corporate/add-director`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  uploadDocumentDirector(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/corporate/director/upload-documents`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  updateDocumentDirector(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/corporate/director/update-documents`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  getDirectorDocListById(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/corporate/director/get-documents-with-directorId`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  getSignatories(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/corporate/get-signatories-with-accountNumber`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  addSignatory(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/corporate/account/add-signatory`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  uplaodSignatoryDoc(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/corporate/signatory/upload-documents`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  getSignatoryDocument(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/corporate/signatory/get-documents-with-signatoryId`, payload, { headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }});
  }

  //Expired Docs

  validateAccount(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/expired/validate-account`, payload);
  }

  
  validateOtp(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/expired/customer-verify-otp`, payload);
  }

  uploadDocs(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/expired/upload-document`, payload);
  }
}
