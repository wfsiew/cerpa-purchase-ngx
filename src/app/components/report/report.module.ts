import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ReportComponent } from './report.component';


@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
    ],
    declarations: [
      ReportComponent,
    ],
    entryComponents: [],
    providers: [],
    exports: [
      ReportComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportModule {}
