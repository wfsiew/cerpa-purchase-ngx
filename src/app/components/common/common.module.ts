//import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NotificationsComponent } from './notifications/notifications.component'
import { NotificationService } from '../../shared/services/notification.service';
import { RouterModule } from '@angular/router';
import { CommontRoute } from './common.route';
import { NotificationsDetailsComponent } from './notifications/notifications-details.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const ENTITY_STATES = [
  ...CommontRoute,
];

@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
      SharedModule,
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
      NotificationsComponent,
      NotificationsDetailsComponent
    ],
    entryComponents: [
    ],
    providers: [
      NotificationService
    ],
    exports: [
      NotificationsComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommonModule {}