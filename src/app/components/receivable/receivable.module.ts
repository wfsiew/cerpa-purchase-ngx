import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ReceivableComponent } from './receivable.component';


@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
    ],
    declarations: [
      ReceivableComponent,
    ],
    entryComponents: [],
    providers: [],
    exports: [
      ReceivableComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReceivableModule {}
