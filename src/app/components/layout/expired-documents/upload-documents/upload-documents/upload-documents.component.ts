import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MainService } from 'src/app/components/services/main.service';
import * as CryptoJS from 'crypto-js';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css']
})
export class UploadDocumentsComponent implements OnInit {

  // isSpinningSubmit = false;
  // uploadCard = true;
  // successShow = false;
  // uploadedFile: any;

  // uploadDetails: any;

  // cardImageBase64!: string;

  // isLoadingTwo = false;

  constructor(
    // private mainService: MainService,
    // private notification: NzNotificationService,
    // private router: Router,
  ) { 
  
  }

  ngOnInit(): void {
  }

  // docUpload(event: any): void{

  //   event.preventDefault();
  //   if (event.target.files.length > 0) {

  //     const max_size = 100000;
  //     const allowed_types = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword'];


  //     if (!_.includes(allowed_types, event.target.files[0].type)) {
  //       console.log(event.target.files[0].type)
  //       alert(event.target.files[0].type);
        
  //       this.notification.info('Means of Id', 'Document type not allowed' );
  
  //         return;
  //     }
      
  //     if (event.target.files[0].size > max_size) {
  //           this.notification.error(' Maximum size allowed is ',+ max_size / 1000 + 'kb');
          
  //         return;
  //     }
   

 
    
  
  //   const reader = new FileReader()
  //   const file = event.target.files[0].name;
  //   this.uploadedFile = file;
  //   reader.onload = (event:any) => {
 
  //     const imgBase64Path = event.target.result;
  //     this.cardImageBase64 = imgBase64Path;
  //   }
  //     reader.readAsDataURL(event.target.files[0])
  //   }
  // }

  // uploadDocSubmit(): void{
  //   this.isLoadingTwo = true;
  //   const account = sessionStorage.getItem('accountNumber');
  //   const formData = {
  //     accountNumber: account,
  //     filename: this.uploadedFile,
  //     base64Encoded: this.cardImageBase64
  //   }
  //   console.log('send', formData)
  //   const key = CryptoJS.enc.Utf8.parse('8080808080808080');
  //   const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
  //   const postDataObj = JSON.stringify(formData);
  //   const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
  //   { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  //   const payload = encryptedData.toString();
  //   const formSending = {
  //     requestParam: payload
  //   }
  //   this.mainService.uploadDocs(formSending).subscribe((result: any) => {
  //     this.uploadDetails = result;
  //     const key = CryptoJS.enc.Utf8.parse('8080808080808080');
  //     const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
  //     const decryptedData = CryptoJS.AES.decrypt(this.uploadDetails.responseParam, key, { iv: iv});
  //     const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
  //     console.log('docsss', decryptedJson)
  //     if (decryptedJson.IsSuccess === true){
  //       this.notification.success('Means Of Id', decryptedJson.RespMessage);
        
  //       this.isLoadingTwo = false;
    
  //       sessionStorage.removeItem('accountNumber');
  //       this.successShow = true;
  //       this.uploadCard = false;
  //     } else {
  //       this.notification.error('Means Of Id', decryptedJson.RespData);
  //       this.isLoadingTwo = false;
  //     }
  //   }, error => {
  //     this.isLoadingTwo = false;
  //     const key = CryptoJS.enc.Utf8.parse('8080808080808080');
  //     const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
  //     const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
  //     const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
  //     this.notification.error('Means Of Id', decryptedJson.RespMessage);
  //   })
  // }

}
