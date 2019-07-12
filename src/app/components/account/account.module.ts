import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  LoginComponent,
  ChangePasswordComponent,
  LogoutComponent,
  UserActivitiesComponent,
  UserDetailComponent,
  UserProfileComponent,
  SettingsComponent,
  SetPasswordComponent
} from '.';
import { SharedModule } from '../../shared/shared.module';
import { LOGIN_ROUTES, CHANGE_PASSWORD_POPUP_ROUTES } from './account.route';
import { AccountService } from './service';
import { SetProfileComponent } from './set-profile';
import { UploadImageComponent } from './set-profile/upload-image';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ComponentsModule } from '../../shared/components/components.module';
import { NotificationService } from '../../shared/services/notification.service';
import { UpdateUserProfileComponent } from './user-profile/update-user-profile.component';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const ENTITY_STATES = [
  ...CHANGE_PASSWORD_POPUP_ROUTES,
  ...LOGIN_ROUTES

];
 
@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ENTITY_STATES),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    LoginComponent,
    SetProfileComponent,
    ChangePasswordComponent,
    LogoutComponent,
    UserActivitiesComponent,
    UserProfileComponent,
    UserDetailComponent,
    SettingsComponent,
    UploadImageComponent,
    SetPasswordComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    UpdateUserProfileComponent
  ],
  entryComponents: [
    UploadImageComponent,
    ChangePasswordComponent
  ],
  providers: [
    AccountService,
    NotificationService,
    // {provide:  MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
  ],
  exports: [
    LoginComponent,
    ChangePasswordComponent,
    LogoutComponent,
    UserActivitiesComponent,
    UserProfileComponent,
    UserDetailComponent,
    SettingsComponent,
    UploadImageComponent,
    SetProfileComponent,
    SetPasswordComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountModule {}
