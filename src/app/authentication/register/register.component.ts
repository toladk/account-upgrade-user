import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthenticationService } from '../services/authentication.service';
import { JarwisService } from '../services/jarwis.service';
import * as CryptoJS from 'crypto-js';
import { ConfirmedValidator } from '../validator/confirm.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  registerCorpForm!: FormGroup;

  isSpinning = false;
  isSpinning1 = false;
  registrationDetails: any;

  individual = false;
  corporate = false;

  showIndividual = false;
  showCorp = false;
  selectType = true;
  accountDetails: any;
  accountDob: any;
  accountEmail: any;
  decryptedJson: any;
  accountName: any;
  accountPhone: any;
  accountTitle: any;
  accountResponseMessage: any;
  accountCustomerId: any;
  accountBranchId: any;
  accountBranchName: any;
  accountNameArray: any;
  accountNumberArray: any;
  accountOpenDate: any;
  accountStatus: any;
  accountTier: any;
  accountFreezeAccount: any;
  accountSchemeCode: any;
  accountSchemeType: any;
  accountCustId: any;

  constructor(
    private formBuilder: FormBuilder,
    private notification: NzNotificationService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private jarwisService: JarwisService,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)]],
      // emailAddress: ['', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]],
      // dateOfBirth: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/[^A-Za-z0-9]+/), Validators.minLength(8)]],
      enableMFa: ['', Validators.required],
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword')
    });

    this.registerCorpForm = this.formBuilder.group({
      accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)]],
      // emailAddress: ['', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]],
      // dateOfBirth: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/[^A-Za-z0-9]+/), Validators.minLength(8)]],
      enableMFa: ['', Validators.required],
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword')
    });
  }

  showForm(e: any): void{
    if (e === 'individual'){
      this.showIndividual = true;
      this.showCorp = false;
      this.selectType = false;
    } else {
      this.showIndividual = false;
      this.showCorp = true;
      this.selectType = false
    }
  }

  onSubmitIndividual(): void{
    const account = sessionStorage.getItem('accountNumber');
    this.isSpinning = true;
        const payload = {
          // responseMessage: this.accountResponseMessage,
          // customerName: this.accountName,
          // customerTitle: this.accountTitle,
          // customerId: this.accountCustomerId,
          // custId: this.accountCustId,
          // customerSex: '',
          accountNumber: account,
          // customerPhone: this.accountPhone,
          // dateOfBirth: this.accountDob,
          password: this.registerForm.value.password,
          confirmPassword: this.registerForm.value.confirmPassword,
          enableMfa: this.registerForm.value.enableMFa,
          // customerAccountDetails : [
          //     {
          //         accountNumber: this.accountNumberArray,
          //         accountName: this.accountNameArray,
          //         AccountOpenDate: this.accountOpenDate,
          //         schemeType: this.accountSchemeType,
          //         schemeCode: this.accountSchemeCode,
          //         accountStatus: this.accountStatus,
          //         bvn: '',
          //         accountBranchId: this.accountBranchId,
          //         accountTier: this.accountTier,
          //         accountBranchName: this.accountBranchName,
          //         freezeStatus: this.accountFreezeAccount,
          //     }
          // ]
        }
        const key = CryptoJS.enc.Utf8.parse('8080808080808080');
        const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
        const postDataObj = JSON.stringify(payload);
        const encryptedReg = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
        { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        const regPayload = encryptedReg.toString();
        const formSending = {
          requestParam: regPayload
        }
        this.jarwisService.signup(formSending).subscribe((result: any) => {
          this.registrationDetails = result;
          const key = CryptoJS.enc.Utf8.parse('8080808080808080');
          const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
          const decryptedreg = CryptoJS.AES.decrypt(this.registrationDetails.responseParam, key, { iv: iv});
          const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
          console.log('them', decryptedJson)
          if(decryptedJson.IsSuccess === true){
            this.router.navigateByUrl('/two-factor-register');

            const randomNo = '34972398822';
            const encryptedEmail = CryptoJS.AES.encrypt(this.registerForm.value.emailAddress, randomNo).toString();
            sessionStorage.setItem('email', encryptedEmail);
            const encryptedPassword = CryptoJS.AES.encrypt(this.registerForm.value.password, randomNo).toString();
            sessionStorage.setItem('password', encryptedPassword);
            this.registerForm.reset();
          } else {

          }
        }, error => {
          this.isSpinning = false;
          const key = CryptoJS.enc.Utf8.parse('8080808080808080');
          const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
          const decryptedreg = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
          const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
          console.log('them', decryptedJson)
          this.notification.error('Sign Up', decryptedJson.RespData[0]);
        })
  }

  getAccountInfoUser(): void{
    const accountNo = sessionStorage.setItem('accountNumber', this.registerForm.value.accountNumber);
    this.isSpinning1 = true;
        const payload = {
          accountNumber: this.registerForm.value.accountNumber
        }
        const key = CryptoJS.enc.Utf8.parse('8080808080808080');
        const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
        const postDataObj = JSON.stringify(payload);
        const encryptedReg = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
        { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        const regPayload = encryptedReg.toString();
        const payloadSend = {
          requestParam: regPayload
        }
        this.jarwisService.validateAccountDetails(payloadSend).subscribe((result: any) => {
          this.accountDetails = result;
          const key = CryptoJS.enc.Utf8.parse('8080808080808080');
          const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
          const decryptedData = CryptoJS.AES.decrypt(this.accountDetails.responseParam, key, { iv: iv});
          this.decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
          console.log('cheeeek.', this.decryptedJson)
          // if (this.decryptedJson.RespData === null){
          //   this.notification.info('Account', this.decryptedJson.ResponseMessage);
          // }
          if (this.decryptedJson.IsSuccess === true) {
            this.notification.info('Account', this.decryptedJson.RespMessage);
            this.notification.info('Account', this.decryptedJson.RespData.CustomerName);
            this.notification.success('Account', this.decryptedJson.RespData.ResponseMessage);
            this.isSpinning1 = false;
            this.individual = true;
            // this.accountCustId = this.decryptedJson.RespData.CustId;
            // this.accountEmail = this.decryptedJson.RespData.CustomerEmail;
            // this.accountDob = this.decryptedJson.RespData.DateOfBirth;
            // this.accountName = this.decryptedJson.RespData.CustomerName;
            // this.accountPhone = this.decryptedJson.RespData.CustomerPhone;
            // this.accountTitle = this.decryptedJson.RespData.CustomerTitle;
            // this.accountResponseMessage = this.decryptedJson.RespData.ResponseMessage;
            // this.accountCustomerId = this.decryptedJson.RespData.customerId;
            // this.accountBranchId = this.decryptedJson.RespData.CustomerAccountsDetails[0].AccountBranchId;
            // this.accountBranchName = this.decryptedJson.RespData.CustomerAccountsDetails[0].AccountBranchName;
            // this.accountNameArray = this.decryptedJson.RespDate.CustomerAccountsDetails[0].AccountName;
            // this.accountNumberArray = this.decryptedJson.RespData.CustomerAccountsDetails[0].AccountNumber;
            // this.accountOpenDate = this.decryptedJson.RespData.CustomerAccountsDetails[0].AccountOpenDate;
            // this.accountStatus = this.decryptedJson.RespData.CustomerAccountsDetails[0].AccountStatus;
            // this.accountTier = this.decryptedJson.RespData.CustomerAccountsDetails[0].AccountTier;
            // this.accountFreezeAccount = this.decryptedJson.RespData.CustomerAccountsDetails[0].FreezeStatus;
            // this.accountSchemeCode = this.decryptedJson.RespData.CustomerAccountsDetails[0].SchemeCode;
            // this.accountSchemeType = this.decryptedJson.RespData.CustomerAccountsDetails[0].SchemeType;
          } else {
            this.isSpinning1 = false;
            const key = CryptoJS.enc.Utf8.parse('8080808080808080');
            const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
            const decryptedreg = CryptoJS.AES.decrypt(this.decryptedJson.responseParam, key, { iv: iv});
            const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
            this.notification.error('Account No', decryptedJson.RespMessage);
          }
        }, error => {
          this.isSpinning1 = false;
          const key = CryptoJS.enc.Utf8.parse('8080808080808080');
          const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
          const decryptedreg = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
          const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
          console.log('them', decryptedJson)
          this.notification.error('Account No', decryptedJson.RespData[0]);
        })
  }

  getAccountInfoCorp(): void{
    const accountNoCorp = sessionStorage.setItem('accountNumber', this.registerCorpForm.value.accountNumber);
    this.isSpinning = true;
        const payload = {
          accountNumber: this.registerCorpForm.value.accountNumber
        }
        const key = CryptoJS.enc.Utf8.parse('8080808080808080');
        const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
        const postDataObj = JSON.stringify(payload);
        const encryptedReg = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
        { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        const regPayload = encryptedReg.toString();
        const payloadSend = {
          requestParam: regPayload
        }
        this.jarwisService.validateAccountDetails(payloadSend).subscribe((result: any) => {
          this.accountDetails = result;
          const key = CryptoJS.enc.Utf8.parse('8080808080808080');
          const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
          const decryptedData = CryptoJS.AES.decrypt(this.accountDetails.responseParam, key, { iv: iv});
          this.decryptedJson = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
          console.log('cheeeek.', this.decryptedJson)
          if (this.decryptedJson.IsSuccess === true) {
            this.notification.info('Account', this.decryptedJson.RespData.CustomerName);
            this.notification.success('Account', this.decryptedJson.RespData.ResponseMessage);
            this.isSpinning = false;
            this.corporate = true;
            // this.accountCustId = this.decryptedJson.RespData.CustId;
            // this.accountEmail = this.decryptedJson.RespData.CustomerEmail;
            // this.accountDob = this.decryptedJson.RespData.DateOfBirth;
            // this.accountName = this.decryptedJson.RespData.CustomerName;
            // this.accountPhone = this.decryptedJson.RespData.CustomerPhone;
            // this.accountTitle = this.decryptedJson.RespData.CustomerTitle;
            // this.accountResponseMessage = this.decryptedJson.RespData.ResponseMessage;
            // this.accountCustomerId = this.decryptedJson.RespData.customerId;
            // this.accountBranchId = this.decryptedJson.RespData.CustomerAccountsDetails[0].AccountBranchId;
            // this.accountBranchName = this.decryptedJson.RespData.CustomerAccountsDetails[0].AccountBranchName;
            // this.accountNameArray = this.decryptedJson.RespDate.CustomerAccountsDetails[0].AccountName;
            // this.accountNumberArray = this.decryptedJson.RespData.CustomerAccountsDetails[0].AccountNumber;
            // this.accountOpenDate = this.decryptedJson.RespData.CustomerAccountsDetails[0].AccountOpenDate;
            // this.accountStatus = this.decryptedJson.RespData.CustomerAccountsDetails[0].AccountStatus;
            // this.accountTier = this.decryptedJson.RespData.CustomerAccountsDetails[0].AccountTier;
            // this.accountFreezeAccount = this.decryptedJson.RespData.CustomerAccountsDetails[0].FreezeStatus;
            // this.accountSchemeCode = this.decryptedJson.RespData.CustomerAccountsDetails[0].SchemeCode;
            // this.accountSchemeType = this.decryptedJson.RespData.CustomerAccountsDetails[0].SchemeType;
          } else {
            this.isSpinning = false;
            const key = CryptoJS.enc.Utf8.parse('8080808080808080');
            const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
            const decryptedreg = CryptoJS.AES.decrypt(this.decryptedJson.responseParam, key, { iv: iv});
            const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
            console.log('them', decryptedJson)
            this.notification.error('Account No', decryptedJson.RespData.ResponseMessage);
          }
        }, error => {
          this.isSpinning = false;
          const key = CryptoJS.enc.Utf8.parse('8080808080808080');
          const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
          const decryptedreg = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
          const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
          console.log('them', decryptedJson)
          this.notification.error('Account No', decryptedJson.RespData[0]);
        })
  }

  onSubmitCorporate(): void{
    const accountCorp = sessionStorage.getItem('accountNumber');
    this.isSpinning = true;
 
        const payload = {
          // responseMessage: this.accountResponseMessage,
          // customerName: this.accountName,
          // customerTitle: this.accountTitle,
          // customerId: this.accountCustomerId,
          // custId: this.accountCustId,
          // customerSex: '',
          accountNumber: accountCorp,
          // customerPhone: this.accountPhone,
          // dateOfBirth: this.accountDob,
          password: this.registerCorpForm.value.password,
          confirmPassword: this.registerCorpForm.value.confirmPassword,
          enableMfa: this.registerCorpForm.value.enableMFa,
          // customerAccountDetails : [
          //     {
          //         accountNumber: this.accountNumberArray,
          //         accountName: this.accountNameArray,
          //         AccountOpenDate: this.accountOpenDate,
          //         schemeType: this.accountSchemeType,
          //         schemeCode: this.accountSchemeCode,
          //         accountStatus: this.accountStatus,
          //         bvn: '',
          //         accountBranchId: this.accountBranchId,
          //         accountTier: this.accountTier,
          //         accountBranchName: this.accountBranchName,
          //         freezeStatus: this.accountFreezeAccount,
          //     }
          // ]
        }
        const key = CryptoJS.enc.Utf8.parse('8080808080808080');
        const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
        const postDataObj = JSON.stringify(payload);
        const encryptedReg = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(postDataObj), key,
        { keySize: 128 / 8, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        const regPayload = encryptedReg.toString();
        const formSending = {
          requestParam: regPayload
        }
        console.log('finding', this.registerCorpForm.value)
        this.jarwisService.signupCorp(formSending).subscribe((result: any) => {
          this.registrationDetails = result;
          const key = CryptoJS.enc.Utf8.parse('8080808080808080');
          const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
          const decryptedreg = CryptoJS.AES.decrypt(this.registrationDetails.responseParam, key, { iv: iv});
          const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
          console.log('them', decryptedJson)
          if(decryptedJson.IsSuccess === true){
            this.router.navigateByUrl('/two-factor-register');
            const randomNo = '34972398822';
            // const encryptedEmail = CryptoJS.AES.encrypt(this.registerCorpForm.value.emailAddress, randomNo).toString();
            // sessionStorage.setItem('email', encryptedEmail);
            const encryptedPassword = CryptoJS.AES.encrypt(this.registerCorpForm.value.password, randomNo).toString();
            sessionStorage.setItem('password', encryptedPassword);
            this.registerCorpForm.reset();
          } else {

          }
        }, error => {
          this.isSpinning = false;
          const key = CryptoJS.enc.Utf8.parse('8080808080808080');
          const iv = CryptoJS.enc.Utf8.parse('8080808080808080');
          const decryptedreg = CryptoJS.AES.decrypt(error.error.responseParam, key, { iv: iv});
          const decryptedJson = JSON.parse(decryptedreg.toString(CryptoJS.enc.Utf8));
          console.log('them', decryptedJson)
          this.notification.error('Sign Up', decryptedJson.RespData[0]);
        })
  }

}
