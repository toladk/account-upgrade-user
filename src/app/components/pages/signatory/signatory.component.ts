import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from './../../../authentication/services/token.service';
import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-signatory',
  templateUrl: './signatory.component.html',
  styleUrls: ['./signatory.component.css']
})
export class SignatoryComponent implements OnInit {

  signatoryGetForm!: FormGroup;

  isSpinningTable = false;

  signatorytList: any [] = []
  signatoryDetails: any;

  constructor(
    private mainService: MainService,
    private notification: NzNotificationService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.signatoryGetForm = this.formBuilder.group({
      accountNo: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)]]
    });
  }

  getSignatory(): void{
    this.isSpinningTable = true;
    const formData = {
      accountNumber: this.signatoryGetForm.value.accountNo
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
    this.mainService.getSignatories(formSending).subscribe((result: any) => {
      this.signatoryDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.signatoryDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.isSpinningTable = false;
        this.notification.success('Signatory', decryptedJson.RespMessage);
        // this.signatorytList = decryptedJson.RespData;
      } else {
        this.notification.success('Signatory', decryptedJson.RespMessage);
        this.isSpinningTable = false;
      }
    }, error => {
      this.isSpinningTable = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Directors', decryptedJson.RespMessage);
    })
  }

}
