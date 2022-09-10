import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from './../../../authentication/services/token.service';
import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { ConfirmedValidator } from 'src/app/authentication/validator/confirm.validator';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

  changeForm!: FormGroup;

  isSpinningSubmit = false;
  changeDetails: any;

  constructor(
    private mainService: MainService,
    private notification: NzNotificationService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.changeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]],
      currentPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(/[^A-Za-z0-9]+/), Validators.minLength(8)]],
    }, {
      validator: ConfirmedValidator('newPassword', 'confirmNewPassword')
    });
  }

  submitPass(): void{
    this.isSpinningSubmit = true;
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    console.log('checking', this.changeForm.value)
    const postDataObj = JSON.stringify(this.changeForm.value);
    const encryptedDetails = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const payload = encryptedDetails.toString();
    const formSending = {
      requestParam: payload
    }
    this.mainService.changePassword(formSending).subscribe((result: any) => {
      this.changeDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedLogin = CryptoJS.AES.decrypt(this.changeDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedLogin.toString(CryptoJS.enc.Utf8));
      console.log('checking data', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.isSpinningSubmit = false;
        this.tokenService.logout();
        this.notification.success('Change Password', decryptedJson.RespData);
      }
    }, error => {
      this.isSpinningSubmit = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedreg = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
      console.log('them', decryptedJson)
      this.notification.error('Change Password', decryptedJson.RespMessage);
    })
  }

}
