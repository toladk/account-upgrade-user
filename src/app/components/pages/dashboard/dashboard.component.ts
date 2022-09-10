import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from './../../../authentication/services/token.service';
import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  addSignatoryForm!: FormGroup;

  accountInfo: any[] = [];
  documentLisType: any[] = [];
  accountDetails: any;
  forT2 = false;
  forT1 = false;
  forT3 = false;
  upgradeforT2 = false;
  upgradeforT3 = false;
  documentDetails: any;
  documentList: any[] = [];
  accList = true;
  uploadedDoc = false;
  accountUp = false;
  twoFactorCheck!: boolean;
  uploadedFileId: any;
  docArray: any[] = [];
  uploadedFileUility: any;
  accountNoToSend: any;
  uploadDocumentDetails: any;
  isSpinningTable = false;
  isSpinningAcc = false;
  isSpinningSubmit = false;
  twoFactorDetails: any;
  accountUpUpdate = false;
  uploadUpdateDocId: any;
  accountNoUpdate: any;
  fileNameFileUpdate: any;
  fileUploadUpdate: any;
  updateDocumentDetails: any;

  showSignatory = false;
  showAddSignatory = false;
  signatoryDetails: any;
  signatoryAccount: any;
  addSignatoryDetails: any;
  signatoryList: any[] = [];
  showUploadSignatoryDoc = false;
  signatoryFileId: any;
  showSignatoryDocument = false;
  signatoryDocumentList: any[] = [];

  constructor(
    private mainService: MainService,
    private notification: NzNotificationService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.addSignatoryForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      position: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      dateOfBirth: ['', Validators.required],
      bvn: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(11)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(11)]],
      email: ['', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]],
    });

    this.getTwoFactor();
    this.getAccountDetails();
  }

  getTwoFactor(): void{
    const factor = sessionStorage.getItem('2factor');
    if(factor === 'true'){
      this.twoFactorCheck = false;
    } else {
      this.twoFactorCheck = true;
    }
  }

  getAccountDetails(): void{
    this.isSpinningAcc = true;
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    const formData = {
      customerId: sessionStorage.getItem('customerId')
    }
    console.log('checking', formData)
    const postDataObj = JSON.stringify(formData);
    const encryptedDetails = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const payload = encryptedDetails.toString();
    const formSending = {
      requestParam: payload
    }
    this.mainService.getAccountDetails(formSending).subscribe((result: any) => {
      this.accountDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedLogin = CryptoJS.AES.decrypt(this.accountDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedLogin.toString(CryptoJS.enc.Utf8));
      console.log('checking data', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.accountInfo = decryptedJson.RespData;
        this.isSpinningAcc = false;
      }
    }, error => {
      this.isSpinningAcc = false;
      this.notification.error( 'Login', this.accountDetails.respMessage );
    })
  }

  viewAccountDash(): void{
    this.accList = true;
    this.accountUp = false;
    this.uploadedDoc = false;
    this.docArray = [];
    this.upgradeforT2 = false;
    this.upgradeforT3 = false;
    this.accountUpUpdate = false;
    this.showSignatory = false;
    this.showAddSignatory = false;
  }

  viewDocument(accountNo: any): void{
    this.isSpinningTable = true;
    this.accList = false;
    this.accountUp = false;
    this.uploadedDoc = true;
    this.accountUpUpdate = false;
    this.accountNoUpdate = accountNo;
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    const formData = {
      accountNumber: accountNo
    }
    const postDataObj = JSON.stringify(formData);
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const payload = encryptedData.toString();
    const formSending = {
      requestParam: payload
    }
    this.mainService.getDocument(formSending).subscribe((result: any) => {
      this.documentDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.documentDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      console.log('doc', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.notification.success('Account Document', 'Document Fetch Successfully !!');
        this.documentList = decryptedJson.RespData;
        this.isSpinningTable = false;
      }
    }, error => {
      this.isSpinningTable = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Token', decryptedJson.RespMessage);
    })

  }

  upgradeAcc(acc: any, tierType: any): void{
      this.isSpinningAcc = true;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const formData = {
        tier: tierType
      }
      const postDataObj = JSON.stringify(formData);
      const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
      { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      const payload = encryptedData.toString();
      const formSending = {
        requestParam: payload
      }
      this.mainService.getDocumentType(formSending).subscribe((result: any) => {
        this.documentDetails = result;
        const key = CryptoJS.enc.Utf8.parse('8080808080808080');
        const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
        const decryptedData = CryptoJS.AES.decrypt(this.documentDetails.responseParam, key, { iv: iv});
        const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
        console.log('doc', decryptedJson)
        if (decryptedJson.IsSuccess === true){
          this.documentLisType = decryptedJson.RespData;
          this.isSpinningAcc = false;
          this.accountUp = true;
          this.accList = false;
          this.uploadedDoc = false;
          this.accountNoToSend = acc;
          this.accountUpUpdate = false;
        }
      }, error => {
        this.isSpinningAcc = false;
        const key = CryptoJS.enc.Utf8.parse('8080808080808080');
        const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
        const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
        const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
        this.notification.error('Token', decryptedJson.RespMessage);
      })

  }

  selectTier(val: any): void{
    if (val.target.value === 'T2'){
      this.upgradeforT2 = true;
      this.upgradeforT3 = false;
    } else {
      this.upgradeforT2 = true;
      this.upgradeforT3 = true;
    }
  }

  idUpload(event: any, fileId: any): void{
    const fileNameFile = event.target.files[0].name;
    const reader = new FileReader();
    reader.onload = () => {
        this.uploadedFileId = reader.result;
        const signImg: string = this.uploadedFileId;
        const idUpload = signImg.split(',')[1]
        console.log('me', idUpload)
        this.docArray.push({
          fileName : fileNameFile,
          base64Encoded : idUpload,
          requiredDocumentId: fileId.toString()
        });
      };
    reader.readAsDataURL(event.target.files[0]);
  }

  uploadDocumentSubmit(): void{
    this.isSpinningSubmit = true;
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    const formData = {
      accountNumber: this.accountNoToSend,
      documents: this.docArray
    }
    console.log('checking', formData)
    const postDataObj = JSON.stringify(formData);
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const payload = encryptedData.toString();
    const formSending = {
      requestParam: payload
    }
    this.mainService.uploadDocument(formSending).subscribe((result: any) => {
      this.uploadDocumentDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.uploadDocumentDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      if (decryptedJson.IsSuccess === true){
        this.isSpinningSubmit = false;
        this.notification.success('Upgrade Account', 'Document(s) Uploaded Successfully !!');
        this.accList = true;
        this.accountUp = false;
        this.uploadedDoc = false;
        this.upgradeforT2 = false;
        this.upgradeforT3 = false;
        this.accountUpUpdate = false;
        this.getAccountDetails();
      }
    }, error => {
      this.isSpinningSubmit = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Token', decryptedJson.RespMessage);
    })
  }

  reuploadDoc(id: any): void{
    this.uploadUpdateDocId = id;
    this.accList = false;
    this.accountUp = false;
    this.uploadedDoc = false;
    this.upgradeforT2 = false;
    this.upgradeforT3 = false;
    this.accountUpUpdate = true;
  }

  uploadDocUpdate(event: any): void{
    this.fileNameFileUpdate = event.target.files[0].name;
    const reader = new FileReader();
    reader.onload = () => {
        this.uploadedFileUility = reader.result;
        const signImg: string = this.uploadedFileUility;
        this.fileUploadUpdate = signImg.split(',')[1]
      };
    reader.readAsDataURL(event.target.files[0])
  }

  uploadDocumentUpdateSubmit(): void{
    this.isSpinningSubmit = true;
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    const formData = {
      accountNumber: this.accountNoUpdate,
      id: this.uploadUpdateDocId,
      fileName: this.fileNameFileUpdate,
      base64Encoded: this.fileUploadUpdate
    }
    console.log('checking', formData)
    const postDataObj = JSON.stringify(formData);
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const payload = encryptedData.toString();
    const formSending = {
      requestParam: payload
    }
    this.mainService.updateDocument(formSending).subscribe((result: any) => {
      this.updateDocumentDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.updateDocumentDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      if (decryptedJson.IsSuccess === true){
        this.isSpinningSubmit = false;
        this.notification.success('Document', 'Document Uploaded Successfully !!');
        this.accList = true;
        this.accountUp = false;
        this.uploadedDoc = false;
        this.upgradeforT2 = false;
        this.upgradeforT3 = false;
        this.accountUpUpdate = false;
        this.getAccountDetails();
      }
    }, error => {
      this.isSpinningSubmit = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Token', decryptedJson.RespMessage);
    })
  }

  enableTwoFactor(): void{
    this.isSpinningAcc = true;
    const randomNo = '34972398822';
    const getEmail: any = sessionStorage.getItem('email');
    const emailTosend = CryptoJS.AES.decrypt( getEmail, randomNo ).toString(CryptoJS.enc.Utf8)
    const formData = {
      email: emailTosend,
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
    this.mainService.enable2factor(formSending).subscribe((result: any) => {
      this.twoFactorDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.twoFactorDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      if (decryptedJson.IsSuccess === true){
        this.isSpinningAcc = false;
        this.tokenService.logout();
      }
    }, error => {
      this.isSpinningAcc = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Token', decryptedJson.RespMessage);
    })

  }

  viewSignatory(accNo: any): void{
    this.showSignatory = true;
    this.accountUp = false;
    this.accountUpUpdate = false;
    this.uploadedDoc = false;
    this.accList = false;
    this.signatoryAccount = accNo;

    this.isSpinningTable = true;
    const formData = {
      accountNumber: this.signatoryAccount
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
        this.signatoryList = decryptedJson.RespData;
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

  addSig(): void{
    this.showAddSignatory = true;
    this.showSignatory = false;
    this.accountUp = false;
    this.accountUpUpdate = false;
    this.uploadedDoc = false;
    this.accList = false;
    this.showUploadSignatoryDoc = false;
  }

  async submitAddSignatory(): Promise<void>{
    this.isSpinningSubmit = true;
    const formData = {
      firstName: this.addSignatoryForm.value.firstName,
      lastName: this.addSignatoryForm.value.lastName,
      position: this.addSignatoryForm.value.position,
      dateOfBirth: this.addSignatoryForm.value.dateOfBirth,
      phoneNumber: this.addSignatoryForm.value.phoneNumber,
      email: this.addSignatoryForm.value.email,
      bvn: this.addSignatoryForm.value.bvn,
      accountNumber: this.signatoryAccount
    }
    console.log('send', formData)
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    const postDataObj = JSON.stringify(formData);
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const payload = encryptedData.toString();
    const formSending = {
      requestParam: payload
    }
    this.mainService.addSignatory(formSending).subscribe((result: any) => {
      this.addSignatoryDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.addSignatoryDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.notification.success('Signatory', 'Signatory Added Successfully !!');
        this.isSpinningSubmit = false;
        this.showAddSignatory = false;
        this.showSignatory = false;
        this.accountUp = false;
        this.accountUpUpdate = false;
        this.uploadedDoc = false;
        this.accList = true;
        this.addSignatoryForm.reset()
      } else {
        this.notification.success('Signatory', decryptedJson.RespMessage);
        this.isSpinningSubmit = false;
      }
    }, error => {
      this.isSpinningSubmit = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Signatory', decryptedJson.RespMessage);
    })
  }

  viewSignatoryList(): void{
    this.showAddSignatory = false;
    this.showSignatory = true;
    this.accountUp = false;
    this.accountUpUpdate = false;
    this.uploadedDoc = false;
    this.accList = false;
    this.showUploadSignatoryDoc = false;
    this.showSignatoryDocument = false;
  }

  uploadSignaDoc(id: any){
    this.showAddSignatory = false;
    this.showSignatory = false;
    this.accountUp = false;
    this.accountUpUpdate = false;
    this.uploadedDoc = false;
    this.accList = false;
    this.showUploadSignatoryDoc = true;
    this.signatoryFileId = id;
  }

  uploadSignatoryDoc(event: any): void{
    this.fileNameFileUpdate = event.target.files[0].name;
    const reader = new FileReader();
    reader.onload = () => {
        this.uploadedFileUility = reader.result;
        const signImg: string = this.uploadedFileUility;
        this.fileUploadUpdate = signImg.split(',')[1]
      };
    reader.readAsDataURL(event.target.files[0])
  }

  async uploadSignatoryDocSubmit(): Promise<void>{
    this.isSpinningSubmit = true;
    const formData = {
      signatoryId: this.signatoryFileId,
      documents: [
          {
              fileName: this.fileNameFileUpdate,
              base64Encoded: this.fileUploadUpdate
          }
      ]
      }
    console.log('send', formData)
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    const postDataObj = JSON.stringify(formData);
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const payload = encryptedData.toString();
    const formSending = {
      requestParam: payload
    }
    this.mainService.uplaodSignatoryDoc(formSending).subscribe((result: any) => {
      this.addSignatoryDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.addSignatoryDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.notification.success('Signatory', 'Signatory Document Uploaded Successfully !!');
        this.isSpinningSubmit = false;
        this.showAddSignatory = false;
        this.showSignatory = false;
        this.accountUp = false;
        this.accountUpUpdate = false;
        this.uploadedDoc = false;
        this.accList = true;
        this.showUploadSignatoryDoc = false;
        this.addSignatoryForm.reset()
      } else {
        this.notification.success('Signatory', decryptedJson.RespMessage);
        this.isSpinningSubmit = false;
      }
    }, error => {
      this.isSpinningSubmit = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Signatory', decryptedJson.RespMessage);
    })
  }

  viewSignaDoc(id: any): void{
    this.showAddSignatory = false;
    this.showSignatory = false;
    this.accountUp = false;
    this.accountUpUpdate = false;
    this.uploadedDoc = false;
    this.accList = false;
    this.showUploadSignatoryDoc = false;
    this.showSignatoryDocument = true;

    this.isSpinningTable = true;
    const formData = {
      signatoryId: id,
    }
    console.log('send', formData)
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    const postDataObj = JSON.stringify(formData);
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
    { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const payload = encryptedData.toString();
    const formSending = {
      requestParam: payload
    }
    this.mainService.getSignatoryDocument(formSending).subscribe((result: any) => {
      this.addSignatoryDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.addSignatoryDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.isSpinningTable = false;
        this.showSignatory = false;
        this.signatoryDocumentList = decryptedJson.RespData;
      } else {
        this.notification.error('Signatory Document', decryptedJson.RespMessage);
        this.isSpinningTable = false;
      }
    }, error => {
      this.isSpinningTable = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Signatory Document', decryptedJson.RespMessage);
    })
  }

}
