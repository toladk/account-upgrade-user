import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthenticationService } from '../services/authentication.service';
import { JarwisService } from '../services/jarwis.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-resetpasswordemail',
  templateUrl: './resetpasswordemail.component.html',
  styleUrls: ['./resetpasswordemail.component.css']
})
export class ResetpasswordemailComponent implements OnInit {

  resetForm!: FormGroup;

  isSpinning = false;
  formShow = true;
  successShow = false;

  resetDetails: any;

  constructor(
    private formBuilder: FormBuilder,
    private notification: NzNotificationService,
    private authenticationService: AuthenticationService,
    private jarwisService: JarwisService,
  ) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]]
    });
  }

  onSubmit(): void{
    this.isSpinning = true;
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    const postDataObj = JSON.stringify(this.resetForm.value);
    const encryptedReg = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const regPayload = encryptedReg.toString();
    const formSending = {
      requestParam: regPayload
    }
    this.authenticationService.getResetPasswordToken(formSending).subscribe((result: any) => {
      this.resetDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedreg = CryptoJS.AES.decrypt(this.resetDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
      console.log('them', decryptedJson)
      if(decryptedJson.IsSuccess === true){
        this.successShow = true;
        this.formShow = false;
        this.resetForm.reset();
        this.isSpinning = false;
      } else {

      }
    }, error => {
      this.isSpinning = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedreg = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
      console.log('them', decryptedJson)
      this.notification.error('Reset Password', decryptedJson.RespData[0]);
    })
  }

}
