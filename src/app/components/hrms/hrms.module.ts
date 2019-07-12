import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HrmsComponent } from './hrms.component';

@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
    ],
    declarations: [
      HrmsComponent
    ],
    entryComponents: [],
    providers: [],
    exports: [
      HrmsComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HrmsModule {}
