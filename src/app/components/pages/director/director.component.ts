import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from './../../../authentication/services/token.service';
import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.css']
})
export class DirectorComponent implements OnInit {

  directorForm!: FormGroup

  isSpinningTable = false;
  isSpinningSubmit = false;

  directorDetails: any;
  directortList: any[] = [];
  showDirector = true;
  showCreate = false;
  showUploadDoc = false;
  showDocList = false;
  shpwUpdateDoc = false;
  addDirectorDetails: any;
  uploadedFileId: any;
  docArray: any[] = [];
  docArrayUpdate: any[] = [];
  directorIdSend: any;
  uploadDetails: any;
  directorDocumentDetails: any;
  directorDocumentList: any[] = [];
  dirId: any;
  docId: any;

  constructor(
    private mainService: MainService,
    private notification: NzNotificationService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.directorForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      position: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      dateOfBirth: ['', Validators.required],
      bvn: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(11)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(11)]],
      email: ['', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]],
    });

    this.getAllDirectors()

  }

  getAllDirectors(): void{
    this.isSpinningTable = true;
    const customerId = sessionStorage.getItem('customerId');
    const formData = {
      customerId: customerId
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
    this.mainService.getAllDirectors(formSending).subscribe((result: any) => {
      this.directorDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.directorDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        // this.notification.success('Directors', 'Directors Fetch Successfully !!');
        this.directortList = decryptedJson.RespData;
        this.isSpinningTable = false;
      } else {
        this.notification.success('Directors', decryptedJson.RespMessage);
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

  addDir(): void{
    this.showDirector = false;
    this.showCreate = true;
    this.showUploadDoc = false;
    this.showDocList = false;
    this.shpwUpdateDoc = false;
  }

  documentList(): void{
    this.showCreate = false;
    this.showDirector = true;
    this.showUploadDoc = false;
    this.showDocList = false;
    this.shpwUpdateDoc = false;
  }

  submitAddDirector(): void{
    this.isSpinningSubmit = true;
    const formData = {
      firstName: this.directorForm.value.firstName,
      lastName: this.directorForm.value.lastName,
      position: this.directorForm.value.position,
      dateOfBirth: this.directorForm.value.dateOfBirth,
      phoneNumber: this.directorForm.value.phoneNumber,
      email: this.directorForm.value.email,
      bvn: this.directorForm.value.bvn,
      customerId: sessionStorage.getItem('customerId')
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
    this.mainService.addDirector(formSending).subscribe((result: any) => {
      this.directorDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.directorDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.notification.success('Director', 'Directors Added Successfully !!');
        this.directortList = decryptedJson.RespData;
        this.isSpinningSubmit = false;
        this.showCreate = false;
        this.showDirector = true;
        this.directorForm.reset()
        this.getAllDirectors()
      } else {
        this.notification.success('Director', decryptedJson.RespMessage);
        this.isSpinningSubmit = false;
      }
    }, error => {
      this.isSpinningSubmit = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Director', decryptedJson.RespMessage);
    })
  }

  uploadDocs(id: any): void{
    this.showCreate = false;
    this.showDirector = false;
    this.showUploadDoc = true;
    this.showDocList = false;
    this.shpwUpdateDoc = false;
    this.directorIdSend = id;
  }

  docUpload(event: any): void{
    for (let i = 0; i < event.target.files.length; i++) {
      const fileName = event.target.files[i].name;
      const reader = new FileReader()
      reader.onload = (event: any) => {
        this.docArray.push({
          filename : fileName,
          base64Encoded : event.target.result.split(',')[1]
        });
      };
      reader.readAsDataURL(event.target.files[i])
    }
  }

  uploadDocSubmit(): void{
    this.isSpinningSubmit = true;
    const formData = {
      directorId: this.directorIdSend,
      documents: this.docArray
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
    this.mainService.uploadDocumentDirector(formSending).subscribe((result: any) => {
      this.uploadDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.uploadDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.notification.success('Upload', decryptedJson.RespData);
        this.showCreate = false;
        this.showDirector = true;
        this.showUploadDoc = false;
        this.showDocList = false;
        this.shpwUpdateDoc = false;
        this.isSpinningSubmit = false;
        this.docArray = [];
      } else {
        this.notification.error('Upload', decryptedJson.RespMessage);
        this.isSpinningSubmit = false;
      }
    }, error => {
      this.isSpinningSubmit = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Director', decryptedJson.RespMessage);
    })
  }

  dirList(): void{
    this.showCreate = false;
    this.showDirector = true;
    this.showUploadDoc = false;
    this.showDocList = false;
    this.shpwUpdateDoc = false;
  }

  getDirectorDocList(id: any): void{
    this.isSpinningTable = true;
    const formData = {
      directorId: id,
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
    this.mainService.getDirectorDocListById(formSending).subscribe((result: any) => {
      this.directorDocumentDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.directorDocumentDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.directorDocumentList = decryptedJson.RespData;
        this.showCreate = false;
        this.showDirector = false;
        this.showUploadDoc = false;
        this.showDocList = true;
        this.isSpinningTable = false;
      } else {
        this.notification.error('Document', decryptedJson.RespMessage);
        this.isSpinningTable = false;
      }
    }, error => {
      this.isSpinningTable = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Director', decryptedJson.RespMessage);
    })
  }

  updateDoc(id: any, dId: any): void{
    this.showCreate = false;
    this.showDirector = false;
    this.showUploadDoc = false;
    this.showDocList = false;
    this.shpwUpdateDoc = true;
    this.docId = id;
    this.dirId = dId;
  }

  docUploadUpdate(event: any): void{
    for (let i = 0; i < event.target.files.length; i++) {
      const fileName = event.target.files[i].name;
      const reader = new FileReader()
      reader.onload = (event: any) => {
        this.docArrayUpdate.push({
          id: this.docId,
          filename : fileName,
          base64Encoded : event.target.result.split(',')[1]
        });
        console.log('check', this.docArrayUpdate)
      };
      reader.readAsDataURL(event.target.files[i])
    }
  }

  updateDocSubmit(): void{
    this.isSpinningSubmit = true;
    const formData = {
      directorId: this.dirId,
      documents: this.docArrayUpdate
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
    this.mainService.updateDocumentDirector(formSending).subscribe((result: any) => {
      this.uploadDetails = result;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedData = CryptoJS.AES.decrypt(this.uploadDetails.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      console.log('docsss', decryptedJson)
      if (decryptedJson.IsSuccess === true){
        this.notification.success('Document Update', decryptedJson.RespData);
        this.showCreate = false;
        this.showDirector = true;
        this.showUploadDoc = false;
        this.showDocList = false;
        this.shpwUpdateDoc = false;
        this.isSpinningSubmit = false;
        this.docArrayUpdate = [];
      } else {
        this.notification.error('Document Update', decryptedJson.RespMessage);
        this.isSpinningSubmit = false;
      }
    }, error => {
      this.isSpinningSubmit = false;
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
      const decryptedInfo = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
      const decryptedJson = JSON.parse(decryptedInfo.toString(CryptoJS.enc.Utf8));
      this.notification.error('Director', decryptedJson.RespMessage);
    })
  }





}
