import { SignatoryComponent } from './components/pages/signatory/signatory.component';
import { DirectorComponent } from './components/pages/director/director.component';
import { ChangepasswordComponent } from './components/pages/changepassword/changepassword.component';
import { ResetpasswordemailComponent } from './authentication/resetpasswordemail/resetpasswordemail.component';
import { TwofactorregisterComponent } from './authentication/twofactorregister/twofactorregister.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { RegisterComponent } from './authentication/register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { TwofactorComponent } from './authentication/twofactor/twofactor.component';
import { MainComponent } from './components/layout/main/main.component';
import { AuthGuard } from './authentication/services/auth.guard';
import { ResetpasswordComponent } from './authentication/resetpassword/resetpassword.component';
import { ExpiredDocumentsComponent } from './components/layout/ExpiredDocuments/expired-documents/expired-documents.component';
// import { AccountValidationComponent } from './components/layout/expired-documents/accountNumber-validation/account-validation/account-validation.component';
import { OtpValidationComponent } from './components/layout/expired-documents/otp-validation/otp-validation/otp-validation.component';
import { UploadDocumentsComponent } from './components/layout/expired-documents/upload-documents/upload-documents/upload-documents.component';

const routes: Routes = [
  {
    path : '',
    redirectTo : 'login',
    pathMatch : 'full'
  },
  // {
  //   path: 'accountValidation',
  //   component: AccountValidationComponent
  // },
  // {
  //   path: 'otp',
  //   component: OtpValidationComponent
  // },
  // {
  //   path: 'uploadExpiredDocs',
  //   component: UploadDocumentsComponent
  // },

  {
    path: 'uploadId',
    component: ExpiredDocumentsComponent
  },
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path : 'two-factor',
    component : TwofactorComponent,
  },
  {
    path : 'reset-account-password',
    component : ResetpasswordemailComponent,
  },
  {
    path : 'reset-password',
    component : ResetpasswordComponent,
  },
  {
    path : 'two-factor-register',
    component : TwofactorregisterComponent,
  },
  {
    path : 'register',
    component : RegisterComponent,
  },
  {
    path : 'main',
    component : MainComponent,
    children : [
      {
        path : '',
        redirectTo : 'dashboard',
        pathMatch : 'full'
      },
      {
        path: 'dashboard',
        component : DashboardComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'change-password',
        component : ChangepasswordComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'director',
        component : DirectorComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'signatory',
        component : SignatoryComponent,
        // canActivate: [AuthGuard]
      },
      {
        path : '**',
        redirectTo : ''
      }
    ]
  },
  {
    path : '**',
    redirectTo : ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
