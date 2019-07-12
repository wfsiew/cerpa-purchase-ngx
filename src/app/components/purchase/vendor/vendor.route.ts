import { Routes } from '@angular/router';
import { VendorComponent } from './vendor.component';
import { VendorDialogControllerComponent } from './vendor-dialog-controller.component';
import { VendorEditComponent } from './vendor-edit.component';
import { VendorViewComponent } from './vendor-view.component';

import { AuthGuardService } from '../../../account/services/auth-guard.service';
export const VENDOR_ROUTES: Routes = [
  {
    path: 'vendor',
    component: VendorComponent,
    canActivate: [AuthGuardService],
    data: {
      authorities: [],
      pageTitle: 'vendor.title'
    }
  },
  {
    path: 'vendor-edit/:id',
    component: VendorEditComponent,
    canActivate: [AuthGuardService],
    data: {
        authorities: [],
        pageTitle: 'vendor.title'
    }
  },
  {
    path: 'vendor/:id',
    component: VendorViewComponent,
    canActivate: [AuthGuardService],
    data: {
        authorities: [],
        pageTitle: 'vendor.title'
    }
  },
];

export const VENDOR_POPUP_ROUTES: Routes = [
  {
      path: 'vendor-invite',
      component: VendorDialogControllerComponent,
      canActivate: [AuthGuardService],
      data: {
          authorities: [],
          pageTitle: 'vendor.title'
      },
      outlet: 'popup'
  }
//   {
//     path: 'vendor-invite',
//     component: UploadImageComponent,
//     data: {
//         authorities: [],
//         pageTitle: 'vendor.title'
//     },
//     outlet: 'popup'
// }
];