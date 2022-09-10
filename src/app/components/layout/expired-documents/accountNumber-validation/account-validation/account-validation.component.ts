import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { MainService } from 'src/app/components/services/main.service';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-account-validation',
  templateUrl: './account-validation.component.html',
  styleUrls: ['./account-validation.component.css']
})
export class AccountValidationComponent implements OnInit {

  
  // accountForm!: FormGroup;

  // isLoadingOne = false;
  // isSpinning = false;
  // isSpinningTable = false;
  // formShow = true;
  // accountDetails: any;
 

  constructor(
    // private formBuilder: FormBuilder,
    // private notification: NzNotificationService,
    // private router: Router,
    // private mainService: MainService,
  ) { }

  ngOnInit(): void {

    // this.accountForm = this.formBuilder.group({
    //   accountNo: ['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)]]
    // });

  }

  // otp(): void {
  //   this.isLoadingOne = true;
  //   const email = sessionStorage.setItem('accountNumber', this.accountForm.value.accountNo);
  //   const formData = {
  //     accountNumber: this.accountForm.value.accountNo,
  //   }
  //   const key = CryptoJS.enc.Utf8.parse('8080808080808080');
  //   const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
  //   const postDataObj = JSON.stringify(formData);
  //   const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
  //   { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  //   const payload = encryptedData.toString();
  //   const formSending = {
  //     requestParam: payload
  //   }
  //   this.mainService.validateAccount(formSending).subscribe((result: any) => {
  //     this.accountDetails = result;
  //     const key = CryptoJS.enc.Utf8.parse('8080808080808080');
  //     const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
  //     const decryptedData = CryptoJS.AES.decrypt(this.accountDetails.responseParam, key, { iv: iv});
  //     const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
  //     console.log('docsss', decryptedJson)
  //     if (decryptedJson.IsSuccess === true){
  //       this.isLoadingOne = false;
  //       this.notification.success('Account', decryptedJson.RespMessage);
  //       this.router.navigateByUrl('/otp');
  //     } else {
  //       this.notification.success('Account', decryptedJson.RespMessage);
  //       this.isLoadingOne = false;
  //     }
  //   }, error => {
  //     this.isLoadingOne = false;
  //     const key = CryptoJS.enc.Utf8.parse('8080808080808080');
  //     const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
  //     const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
  //     const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
  //     this.notification.error('Account', decryptedJson.RespMessage);
  //   })
  // }
  }


