import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { PayableComponent } from './payable.component';


@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
    ],
    declarations: [
      PayableComponent
    ],
    entryComponents: [],
    providers: [],
    exports: [
      PayableComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PayableModule {}
