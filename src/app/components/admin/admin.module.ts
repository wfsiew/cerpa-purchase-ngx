import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AdminComponent, ADMIN_ROUTE } from '.';

@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
      RouterModule.forChild([ADMIN_ROUTE])
    ],
    declarations: [
      AdminComponent
    ],
    entryComponents: [],
    providers: [],
    exports: [
      AdminComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule {}
