import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthenticationService } from '../services/authentication.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-twofactorregister',
  templateUrl: './twofactorregister.component.html',
  styleUrls: ['./twofactorregister.component.css']
})
export class TwofactorregisterComponent implements OnInit {

  factorForm!: FormGroup;

  isSpinning = false;

  otpDetails: any;
  emailToSend: any;
  twoFaDetails: any;
  confirmEmail: any;

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
      console.log('checking', this.factorForm.value);

      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const postDataObj = JSON.stringify(this.factorForm.value);
      const encryptedlogin = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
      { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      const loginPayload = encryptedlogin.toString();
      const formSending = {
        requestParam: loginPayload
      }
      await this.authenticationService.verifyOtp(formSending).toPromise().then((result: any) => {
        this.otpDetails = result;
        const key = CryptoJS.enc.Utf8.parse('8080808080808080');
        const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
        const decryptedLogin = CryptoJS.AES.decrypt(this.otpDetails.responseParam, key, { iv: iv});
        const decryptedJson = JSON.parse(decryptedLogin.toString(CryptoJS.enc.Utf8));
        console.log('memme', decryptedJson)
        if (decryptedJson.IsSuccess === true) {
          const getEmail2: any = sessionStorage.getItem('email');
          const emailToSend2 = CryptoJS.AES.decrypt( getEmail2, randomNo ).toString(CryptoJS.enc.Utf8)
          const formSend = {
            email: emailToSend2,
            isEmailConfirmed: true,
          }
          console.log('formSend2', formSend)
          const key = CryptoJS.enc.Utf8.parse('8080808080808080');
          const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
          const postDataObj = JSON.stringify(formSend);
          const encryptedConfirm = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
          { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
          const confirmPayload = encryptedConfirm.toString();
          const formSending = {
            requestParam: confirmPayload
          }
          this.authenticationService.confirmEmail(formSending).toPromise().then((result: any) => {
            this.confirmEmail = result;
            const key = CryptoJS.enc.Utf8.parse('8080808080808080');
            const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
            const decryptedLogin = CryptoJS.AES.decrypt(this.confirmEmail.responseParam, key, { iv: iv});
            const decryptedJson = JSON.parse(decryptedLogin.toString(CryptoJS.enc.Utf8));
            console.log('checking data 2', decryptedJson)
            if (decryptedJson.IsSuccess === true) {
              this.isSpinning = false;
              this.router.navigateByUrl('/login');
            }
          }, error => {
            this.isSpinning = false;
            const key = CryptoJS.enc.Utf8.parse('8080808080808080');
            const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
            const decryptedreg = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
            const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
            console.log('them', decryptedJson)
            this.notification.error('Token', decryptedJson.RespMessage);
          })
        }
      }, error => {
        this.isSpinning = false;
        const key = CryptoJS.enc.Utf8.parse('8080808080808080');
        const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
        const decryptedreg = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
        const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
        console.log('them', decryptedJson)
        this.notification.error('Token', decryptedJson.RespMessage);
      })
    } catch(error: any) {
      this.isSpinning = false;
      // this.notification.error( 'Login', error.error.respMessage );
    }
  }

}
