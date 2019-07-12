import { Routes } from '@angular/router';
import { LoginComponent } from './login';
import { LogoutComponent } from './logout';
import { AuthGuardService } from '../../account/services/auth-guard.service';
import { SetPasswordComponent } from './set-password/set-password.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SetProfileComponent } from './set-profile';
import { ChangePasswordComponent } from './change-password';
import { ForgotPasswordComponent } from './forgot-password';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UpdateUserProfileComponent } from './user-profile';

export const LOGIN_ROUTES: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuardService],
  }, 
  {
    pathMatch: 'full',
    path: 'activate',
    component: SetPasswordComponent
  },
  {
    pathMatch: 'full',
    path: 'register',
    component: SetProfileComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuardService]
  },  
  {
    path: 'update-profile',
    component: UpdateUserProfileComponent,
    canActivate: [AuthGuardService]
  },    
  {
    pathMatch: 'full',
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    pathMatch: 'full',
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  // {
  //   path: 'user-profile',
  //   component: UserProfileComponent
  // }
]  

export const CHANGE_PASSWORD_POPUP_ROUTES: Routes = [
  {
      path: 'change-password',
      component: ChangePasswordComponent,
      canActivate: [AuthGuardService],
      data: {
          authorities: [],
          pageTitle: 'vendor.title'
      },
      outlet: 'popup'
  },
  {
    path: 'update-profile',
    component: UpdateUserProfileComponent,
    canActivate: [AuthGuardService],
    data: {
        authorities: [],
        pageTitle: 'vendor.title'
    },
    outlet: 'popup'
}
]; 