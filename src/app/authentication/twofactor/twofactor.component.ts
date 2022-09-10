import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthenticationService } from '../services/authentication.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-twofactor',
  templateUrl: './twofactor.component.html',
  styleUrls: ['./twofactor.component.css']
})
export class TwofactorComponent implements OnInit {

  factorForm!: FormGroup;

  isSpinning = false;

  otpDetails: any;
  emailToSend: any;
  twoFaDetails: any;

  constructor(
    private formBuilder: FormBuilder,
    private notification: NzNotificationService,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.factorForm = this.formBuilder.group({
      email: ['', Validators.required],
      otp: ['', Validators.required],
      token1: ['', Validators.required],
      token2: ['', Validators.required],
      token3: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void>{
    try {
      this.isSpinning = true;
      const randomNo = '34972398822';
      const getEmail: any = sessionStorage.getItem('email');
      const emailTosend = CryptoJS.AES.decrypt( getEmail, randomNo ).toString(CryptoJS.enc.Utf8)
      this.factorForm.value.email = emailTosend
      this.factorForm.value.otp = `${this.factorForm.value.token1}${this.factorForm.value.token2}${this.factorForm.value.token3}`
      delete this.factorForm.value.token1;
      delete this.factorForm.value.token2;
      delete this.factorForm.value.token3;

      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const postDataObj = JSON.stringify(this.factorForm.value);
      const encryptedlogin = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
      { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      const loginPayload = encryptedlogin.toString();
      const formSending = {
        requestParam: loginPayload
      }
      await this.authenticationService.verifyOtp(formSending).toPromise().then(async (result: any) => {
        this.otpDetails = result;
        const key = CryptoJS.enc.Utf8.parse('8080808080808080');
        const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
        const decryptedLogin = CryptoJS.AES.decrypt(this.otpDetails.responseParam, key, { iv: iv});
        const decryptedJson = JSON.parse(decryptedLogin.toString(CryptoJS.enc.Utf8));
        console.log('memme', decryptedJson)
        if (decryptedJson.RespMessage === 'Otp validated successfully'){
          const key = CryptoJS.enc.Utf8.parse('8080808080808080');
          const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
          const getPassword: any = sessionStorage.getItem('password');
          const passwordTosend = CryptoJS.AES.decrypt( getPassword, randomNo ).toString(CryptoJS.enc.Utf8)
          const formSend = {
            email: emailTosend,
            password: passwordTosend,
          }
          const postDataObj = JSON.stringify(formSend);
          const encrypted2fa = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
          { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
          const twofaPayload = encrypted2fa.toString();
          const formSending = {
            requestParam: twofaPayload
          }
          await this.authenticationService.twoFactor(formSending).toPromise().then((result: any) => {
            this.twoFaDetails = result;
            const key = CryptoJS.enc.Utf8.parse('8080808080808080');
            const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
            const decryptedLogin = CryptoJS.AES.decrypt(this.twoFaDetails.responseParam, key, { iv: iv});
            const decryptedJson = JSON.parse(decryptedLogin.toString(CryptoJS.enc.Utf8));
            console.log('checking data', decryptedJson)
            if (decryptedJson.IsSuccess === true) {
              this.router.navigateByUrl('/main/dashboard').then(() => {window.location.reload(); });
              this.notification.success( 'Login', 'Logged In Successfully !!');
              sessionStorage.setItem('customerId', decryptedJson.RespData.CustomerId)
            }
          })

        } else {
          this.isSpinning = false;
          this.notification.error( 'Login', this.otpDetails.respMessage );
        }
      })
    } catch(error: any) {
      this.isSpinning = false;
      this.notification.error( 'Login', error.error.respMessage );
    }
  }

}
