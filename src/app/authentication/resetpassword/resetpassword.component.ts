import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthenticationService } from '../services/authentication.service';
import { JarwisService } from '../services/jarwis.service';
import * as CryptoJS from 'crypto-js';
import { ConfirmedValidator } from '../validator/confirm.validator';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  resetForm!: FormGroup;

  isSpinning = false;
  userIdToSend: any;
  tokenToSend: any;
  resetDetails: any;

  constructor(
    private formBuilder: FormBuilder,
    private notification: NzNotificationService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private jarwisService: JarwisService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      token: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(/[^A-Za-z0-9]+/), Validators.minLength(8)]],
      userId: ['', Validators.required],
    }, {
      validator: ConfirmedValidator('newPassword', 'confirmNewPassword')
    });

    this.getDataFromUrl();

  }

  getDataFromUrl(): void{
    this.activatedRoute.queryParams.subscribe(params => {
      this.userIdToSend = params['userId'];
      this.tokenToSend = params['token'];
    })
  }

  onSubmit(): void{
    this.isSpinning = true;
        const key = CryptoJS.enc.Utf8.parse('8080808080808080');
        const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
        const payload = {
          userId: this.userIdToSend,
          newPassword: this.resetForm.value.newPassword,
          confirmNewPassword: this.resetForm.value.confirmNewPassword,
          token: this.tokenToSend.split(' ').join('+')
        }
        console.log('payload', payload)
        const postDataObj = JSON.stringify(payload);
        const encryptedReg = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
        { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        const regPayload = encryptedReg.toString();
        const formSending = {
          requestParam: regPayload
        }
        this.authenticationService.resetPassword(formSending).subscribe((result: any) => {
          this.resetDetails = result;
          const key = CryptoJS.enc.Utf8.parse('8080808080808080');
          const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
          const decryptedreg = CryptoJS.AES.decrypt(this.resetDetails.responseParam, key, { iv: iv});
          const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
          console.log('them', decryptedJson)
          if(decryptedJson.IsSuccess === true){
            this.resetForm.reset();
            this.isSpinning = false;
            this.router.navigateByUrl('/login');
            this.notification.success('Reset Password', decryptedJson.RespData);
          } else {
            this.isSpinning = false;
            this.notification.error('Reset Password', decryptedJson.RespMessage);
          }
        }, error => {
          this.isSpinning = false;
          const key = CryptoJS.enc.Utf8.parse('8080808080808080');
          const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
          const decryptedreg = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
          const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
          console.log('them', decryptedJson)
          this.notification.error('Reset Password', decryptedJson.RespData);
        })
}
}
