import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { LedgerComponent } from './ledger.component';


@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
    ],
    declarations: [
      LedgerComponent
    ],
    entryComponents: [],
    providers: [],
    exports: [
      LedgerComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LedgerModule {}
