import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UseErrorInterceptor } from './authentication/services/error.interceptor';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import en from '@angular/common/locales/en';
import { LoginComponent } from './authentication/login/login.component';
import { TwofactorComponent } from './authentication/twofactor/twofactor.component';
import { RegisterComponent } from './authentication/register/register.component';
import { MainComponent } from './components/layout/main/main.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { TwofactorregisterComponent } from './authentication/twofactorregister/twofactorregister.component';
import { ResetpasswordComponent } from './authentication/resetpassword/resetpassword.component';
import { ResetpasswordemailComponent } from './authentication/resetpasswordemail/resetpasswordemail.component';
import { ChangepasswordComponent } from './components/pages/changepassword/changepassword.component';
import { DirectorComponent } from './components/pages/director/director.component';
import { SignatoryComponent } from './components/pages/signatory/signatory.component';
import { ExpiredDocumentsComponent } from './components/layout/ExpiredDocuments/expired-documents/expired-documents.component';
import { AccountValidationComponent } from './components/layout/expired-documents/accountNumber-validation/account-validation/account-validation.component';
import { OtpValidationComponent } from './components/layout/expired-documents/otp-validation/otp-validation/otp-validation.component';
import { UploadDocumentsComponent } from './components/layout/expired-documents/upload-documents/upload-documents/upload-documents.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TwofactorComponent,
    RegisterComponent,
    MainComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    TwofactorregisterComponent,
    ResetpasswordComponent,
    ResetpasswordemailComponent,
    ChangepasswordComponent,
    DirectorComponent,
    SignatoryComponent,
    ExpiredDocumentsComponent,
    AccountValidationComponent,
    OtpValidationComponent,
    UploadDocumentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzMessageModule,
    NzTabsModule,
    NzTableModule,
    NzDrawerModule,
    NzFormModule,
    NzSelectModule,
    NzIconModule,
    NzDatePickerModule,
    NzInputModule,
    NzStepsModule,
    NzListModule,
    NzResultModule,
    NzGridModule,
    NzUploadModule,
    NzNotificationModule,
    NzPopconfirmModule,
    NzInputNumberModule,
    NzSkeletonModule,
    NzBadgeModule,
    NzModalModule,
    NzCollapseModule,
    NzPaginationModule,
    NzSpinModule,
    NzTimePickerModule,
    NzToolTipModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [UseErrorInterceptor, { provide: NZ_I18N, useValue: en_US }, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
