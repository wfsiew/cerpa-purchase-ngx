import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { TabComponent } from './tab/tab.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SharedLibsModule } from '../shared-libs.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { errorHandlerComponent } from './error-handler';
import { CardComponent } from './card';
import { ConfirmCompleteDialogComponent } from './confirm-complete-dialog/confirm-complete-dialog.component';
import { MessageDialogComponent } from './message-dialog';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    RouterModule,
    BrowserModule,
    SharedLibsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    CardComponent,
    TabComponent,
    ConfirmDialogComponent,
    errorHandlerComponent,
    MessageDialogComponent,
    ConfirmCompleteDialogComponent
  ],
  entryComponents: [
    ConfirmDialogComponent,
    CardComponent,
    errorHandlerComponent
  ],
  exports: [
    TabComponent,
    CardComponent,
    ConfirmDialogComponent,
    errorHandlerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
