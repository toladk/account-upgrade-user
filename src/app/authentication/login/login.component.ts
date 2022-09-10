import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthenticationService } from '../services/authentication.service';
import { JarwisService } from '../services/jarwis.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  isSpinning = false;

  loginDetails: any;
  decryptedLogin!: CryptoJS.lib.WordArray;

  constructor(
    private formBuilder: FormBuilder,
    private notification: NzNotificationService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private jarwisService: JarwisService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void>{
    try{

      this.isSpinning = true;
      const payload = {

        email: this.loginForm.value.email,
        password: this.loginForm.value.password

      };
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const postDataObj = JSON.stringify(payload);
      const encryptedlogin = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
      { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      const loginPayload = encryptedlogin.toString();
      const formSending = {
        requestParam: loginPayload
      }
              await this.jarwisService.login(formSending).toPromise().then((result: any) => {
                this.loginDetails = result;
                //alert('alert')
                const key = CryptoJS.enc.Utf8.parse('8080808080808080');
                const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
                const decryptedLogin = CryptoJS.AES.decrypt(this.loginDetails.responseParam, key, { iv: iv});
                const decryptedJson = JSON.parse(decryptedLogin.toString(CryptoJS.enc.Utf8));
                sessionStorage.setItem('token',decryptedJson.RespData.Token.AccessToken);
                console.log('them', decryptedJson)

                if (decryptedJson.RespData.RequiresTwoFactor === true){
                  //console.log('mmmm', decryptedJson.RespData.RequiresTwoFactor,)
                  this.isSpinning = false;
                  this.router.navigateByUrl('/two-factor');
                  sessionStorage.setItem('2factor', decryptedJson.RespData.RequiresTwoFactor);

                  const randomNo = '34972398822';
                  const encryptedEmail = CryptoJS.AES.encrypt(this.loginForm.value.email, randomNo).toString();
                  sessionStorage.setItem('email', encryptedEmail);
                  const encryptedPassword = CryptoJS.AES.encrypt(this.loginForm.value.password, randomNo).toString();
                  sessionStorage.setItem('password', encryptedPassword);

                } else {
                 // alert('Hello')
                  this.isSpinning = false;
                  this.router.navigateByUrl('/main/dashboard').then(() => {window.location.reload(); });
                  const randomNo = '34972398822';
                  const encryptedEmail = CryptoJS.AES.encrypt(this.loginForm.value.email, randomNo).toString();
                  sessionStorage.setItem('email', encryptedEmail);
                  const encryptedPassword = CryptoJS.AES.encrypt(this.loginForm.value.password, randomNo).toString();
                  sessionStorage.setItem('password', encryptedPassword);
                  sessionStorage.setItem('customerId', decryptedJson.RespData.CustomerId);
                  sessionStorage.setItem('2factor', decryptedJson.RespData.RequiresTwoFactor);

                }
              }, error => {
                this.isSpinning = false;
                const key = CryptoJS.enc.Utf8.parse('8080808080808080');
                const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
                const decryptedreg = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
                const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
                console.log('them', decryptedJson)
                this.notification.error('Login', decryptedJson.RespMessage);
              })
    } catch(error: any) {
      this.isSpinning = false;
      this.notification.error( 'Login', error.error.respMessage);
    }
  }

}
