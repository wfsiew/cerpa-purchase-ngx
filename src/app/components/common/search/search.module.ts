//import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SearchComponent } from './search.component';
import { SearchService } from './search.service';
// const ENTITY_STATES = [
//   ...VENDOR_ROUTES,
//   ...VENDOR_POPUP_ROUTES,
// ];

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
      SharedModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      })
      // RouterModule.forChild(ENTITY_STATES),
      // MatDialogModule,
    ],
    declarations: [
      SearchComponent
      // VendorComponent,
      // VendorDialogControllerComponent,
      // VendorEditComponent,
      // VendorInviteDialogComponent,
    ],
    entryComponents: [
      // VendorInviteDialogComponent,
    ],
    providers: [
      SearchService,
      // VendorService,
      // {
      //   provide: HTTP_INTERCEPTORS, 
      //   useClass: AuthInterceptor, 
      //   multi:true
      // }
    ],
    exports: [
      SearchComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchModule {}