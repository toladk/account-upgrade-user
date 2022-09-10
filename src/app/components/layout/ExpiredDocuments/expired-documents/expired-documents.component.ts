import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { MainService } from 'src/app/components/services/main.service';
import * as CryptoJS from 'crypto-js';
import * as _ from 'lodash';

@Component({
  selector: 'app-expired-documents',
  templateUrl: './expired-documents.component.html',
  styleUrls: ['./expired-documents.component.css']
})
export class ExpiredDocumentsComponent implements OnInit {

  accountForm!: FormGroup;

  isLoadingOne = false;
  isLoadingTwo = false;
  isLoadingThree = false;

  isSpinning1 = false;
  isSpinning2 = false;
  isSpinning3 = false;
  isSpinningTable = false;

  formShow = true;
  accountDetails: any;


  otpForm!: FormGroup;

  uploadForm!: FormGroup;


  formShowTwo = false;
  otpDetails: any;

  formShowThree = false;
  formShowFour = false;
  uploadedFile: any;

  uploadDetails: any;

  cardImageBase64!: string;

  constructor(
    private formBuilder: FormBuilder,
    private notification: NzNotificationService,
    private router: Router,
    private mainService: MainService,
  ) { }

  ngOnInit(): void {
    this.accountForm = this.formBuilder.group({
      accountNo: ['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)]]
    });

    this.otpForm = this.formBuilder.group({
      otp: ['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6)]]
    });

    this.uploadForm = this.formBuilder.group({
      id: ['',[Validators.required,]]
    });

  }


  accountValidation(): void {
    this.isSpinning1 = false;
    this.isLoadingOne = true;
    const email = sessionStorage.setItem('accountNumber', this.accountForm.value.accountNo);
    const formData = {
      accountNumber: this.accountForm.value.accountNo,
    }
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    const postDataObj = JSON.stringify(formData);
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const payload = encryptedData.toString();
    const formSending = {
      requestParam: payload
    }
    this.mainService.validateAccount(formSending).subscribe((result: any) => {
      this.accountDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.accountDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
     // console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.isLoadingOne = false;
        this.notification.success('Account', decryptedJson.RespMessage);
       // this.router.navigateByUrl('/otp');
       this.formShowFour = false;
       this.formShowThree = false;
       this.formShowTwo = true;
       this.formShow = false;
      } else {
        this.notification.success('Account', decryptedJson.RespMessage);
        this.isLoadingOne = false;
      }
    }, error => {
      this.isLoadingOne = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Account', decryptedJson.RespMessage);
    })
  }

  otpValidation(): void {
    this.isSpinning2 = false;
    this.isLoadingTwo = true;
    const account = sessionStorage.getItem('accountNumber');
    const formData = {
      otp: this.otpForm.value.otp,
      accountNumber: account
    }
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    const postDataObj = JSON.stringify(formData);
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const payload = encryptedData.toString();
    const formSending = {
      requestParam: payload,
    }
    this.mainService.validateOtp(formSending).subscribe((result: any) => {
      this.otpDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.otpDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      //console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.isLoadingTwo = false;
        this.notification.info('OTP', decryptedJson.RespData.CustomerName)
        this.notification.success('OTP', decryptedJson.RespMessage);
        //this.router.navigateByUrl('/uploadExpiredDocs');
        this.formShowFour = false;
        this.formShowThree = true;
        this.formShowTwo = false;
        this.formShow = false;
      } else {
        this.notification.success('OTP', decryptedJson.RespMessage);
        this.isLoadingTwo = false;
      }
    }, error => {
      this.isLoadingTwo = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('OTP', decryptedJson.RespMessage);
    })
  }


  docUpload(event: any): void{

    event.preventDefault();
    if (event.target.files.length > 0) {

      const max_size = 100000;
      const allowed_types = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword'];


      if (!_.includes(allowed_types, event.target.files[0].type)) {
        //console.log(event.target.files[0].type)
        alert(event.target.files[0].type);
        
        this.notification.info('Means of Id', 'Document type not allowed' );
  
          return;
      }
      
      if (event.target.files[0].size > max_size) {
            this.notification.error(' Maximum size allowed is ',+ max_size / 1000 + 'kb');
          
          return;
      }
   

 
    //alert('check');
  
    const reader = new FileReader()
    const file = event.target.files[0].name;
    this.uploadedFile = file;
    reader.onload = (event:any) => {
 
      const imgBase64Path = event.target.result;
      this.cardImageBase64 = imgBase64Path;
    }
      reader.readAsDataURL(event.target.files[0])
    }
  }

  uploadDocSubmit(): void{
    this.isSpinning3 = false;
    this.isLoadingThree = true;
    const account = sessionStorage.getItem('accountNumber');
    const formData = {
      accountNumber: account,
      filename: this.uploadedFile,
      base64Encoded: this.cardImageBase64
    }
   // console.log('send', formData)
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    const postDataObj = JSON.stringify(formData);
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const payload = encryptedData.toString();
    const formSending = {
      requestParam: payload
    }
    this.mainService.uploadDocs(formSending).subscribe((result: any) => {
      this.uploadDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.uploadDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
     // console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.notification.success('Means Of Id', decryptedJson.RespMessage);
        
        this.isLoadingThree = false;
       // this.router.navigateByUrl('/accountValidation');
        sessionStorage.removeItem('accountNumber');
        this.formShowFour = true;
        this.formShowThree = false;
        this.formShowTwo = false;
        this.formShow = false;
      } else {
        this.notification.error('Means Of Id', decryptedJson.RespData);
        this.isLoadingThree = false;
      }
    }, error => {
      this.isLoadingThree = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Means Of Id', decryptedJson.RespMessage);
    })
  }

  resendOtp(): void {
    // this.isSpinning1 = false;
    // this.isLoadingOne = true;
    const email = sessionStorage.getItem('accountNumber');
    const formData = {
      accountNumber: email,
    }
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    const postDataObj = JSON.stringify(formData);
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const payload = encryptedData.toString();
    const formSending = {
      requestParam: payload
    }
    this.mainService.validateAccount(formSending).subscribe((result: any) => {
      this.accountDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.accountDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      //console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.isLoadingOne = false;
        this.notification.success('Successful',' Kindly check your registered email address');
       // this.router.navigateByUrl('/otp');
      //  this.formShowFour = false;
      //  this.formShowThree = false;
      //  this.formShowTwo = true;
      //  this.formShow = false;
      } else {
        this.notification.success('Account', decryptedJson.RespMessage);
        this.isLoadingOne = false;
      }
    }, error => {
      this.isLoadingOne = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Account', decryptedJson.RespMessage);
    })
  }

}
