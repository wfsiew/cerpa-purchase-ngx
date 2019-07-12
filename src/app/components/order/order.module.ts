import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { OrderComponent } from './order.component';


@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
    ],
    declarations: [
      OrderComponent,
    ],
    entryComponents: [],
    providers: [],
    exports: [
      OrderComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderModule {}
