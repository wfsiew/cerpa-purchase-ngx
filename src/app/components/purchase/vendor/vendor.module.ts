import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { VendorComponent } from './vendor.component';
import { VENDOR_ROUTES, VENDOR_POPUP_ROUTES } from './vendor.route';
import { VendorInviteDialogComponent } from './vendor-invite-dialog.component';
import { VendorDialogControllerComponent } from './vendor-dialog-controller.component';
import { VendorViewComponent } from './vendor-view.component';
import { VendorEditComponent } from './vendor-edit.component';
import { VendorService } from './vendor.service';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../shared/components/components.module';
import { UploadVendorImageComponent } from './upload-image-dialog';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const ENTITY_STATES = [
  ...VENDOR_ROUTES,
  ...VENDOR_POPUP_ROUTES,
];

@NgModule({ 
  imports: [
    FormsModule,
    BrowserModule,
    RouterModule.forChild(ENTITY_STATES),
    MatDialogModule,
    HttpClientModule,
    SharedModule,
    ComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    VendorComponent,
    VendorDialogControllerComponent,
    VendorViewComponent,
    VendorEditComponent,
    VendorInviteDialogComponent,
    UploadVendorImageComponent
  ],
  entryComponents: [
    VendorInviteDialogComponent,
    UploadVendorImageComponent
  ],
  providers: [
    VendorService,
    {provide:  MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
  ],
  exports: [ 
    VendorComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VendorModule {}
