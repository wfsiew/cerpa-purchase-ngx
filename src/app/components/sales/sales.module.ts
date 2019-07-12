import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { SalesComponent } from './sales.component';


@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
    ],
    declarations: [
      SalesComponent,
    ],
    entryComponents: [],
    providers: [],
    exports: [
      SalesComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SalesModule {}
