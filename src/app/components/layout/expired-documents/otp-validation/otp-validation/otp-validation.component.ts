import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MainService } from 'src/app/components/services/main.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-otp-validation',
  templateUrl: './otp-validation.component.html',
  styleUrls: ['./otp-validation.component.css']
})
export class OtpValidationComponent implements OnInit {

   
  
  // isSpinning = false;
  // isSpinningTable = false;
  // isLoadingThree = false;
  // otpForm!: FormGroup;


  // formShow = true;
  // otpDetails: any;
 

  constructor(
    // private formBuilder: FormBuilder,
    // private notification: NzNotificationService,
    // private router: Router,
    // private mainService: MainService,
  ) { }

  ngOnInit(): void {

    // this.otpForm = this.formBuilder.group({
    //   otp: ['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6)]]
    // });

  }

  
  // expiredDocs(): void {
  //   this.isLoadingThree = true;
  //   const account = sessionStorage.getItem('accountNumber');
  //   const formData = {
  //     otp: this.otpForm.value.otp,
  //     accountNumber: account
  //   }
  //   const key = CryptoJS.enc.Utf8.parse('8080808080808080');
  //   const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
  //   const postDataObj = JSON.stringify(formData);
  //   const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
  //   { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  //   const payload = encryptedData.toString();
  //   const formSending = {
  //     requestParam: payload,
  //   }
  //   this.mainService.validateOtp(formSending).subscribe((result: any) => {
  //     this.otpDetails = result;
  //     const key = CryptoJS.enc.Utf8.parse('8080808080808080');
  //     const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
  //     const decryptedData = CryptoJS.AES.decrypt(this.otpDetails.responseParam, key, { iv: iv});
  //     const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
  //     console.log('docsss', decryptedJson)
  //     if (decryptedJson.IsSuccess === true){
  //       this.isLoadingThree = false;
  //       this.notification.info('OTP', decryptedJson.RespData.CustomerName)
  //       this.notification.success('OTP', decryptedJson.RespMessage);
  //       this.router.navigateByUrl('/uploadExpiredDocs');
  //     } else {
  //       this.notification.success('OTP', decryptedJson.RespMessage);
  //       this.isLoadingThree = false;
  //     }
  //   }, error => {
  //     this.isLoadingThree = false;
  //     const key = CryptoJS.enc.Utf8.parse('8080808080808080');
  //     const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
  //     const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
  //     const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
  //     this.notification.error('OTP', decryptedJson.RespMessage);
  //   })
  // }

}
