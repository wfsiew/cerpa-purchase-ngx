import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PRODUCT_PRICING_ROUTES, LOOK_UP_POPUP_ROUTES} from './purchase-request.route';
import { IssuePurchaseRequestComponent } from './issue-pr.component'; 
import { ComponentsModule } from '../../../shared/components/components.module';
import { PurchaseRequestService } from './purchase-request.service';
import { LookUpComponent } from './look-up';

import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { PurchaseRequestListComponent } from './p-request-list.component';
import { ViewPurchaseRequestComponent } from './view-pr.component';
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
 
const ENTITY_STATES = [
    ...PRODUCT_PRICING_ROUTES,
    ...LOOK_UP_POPUP_ROUTES,
];

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        BrowserModule,
        
        RouterModule.forChild(ENTITY_STATES),
        HttpClientModule,
        SharedModule,
        ComponentsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    declarations: [
        LookUpComponent,
        PurchaseRequestListComponent,
        ViewPurchaseRequestComponent,
        IssuePurchaseRequestComponent,
    ],
    entryComponents: [
        LookUpComponent,
    ],
    providers: [
        PurchaseRequestService,
        {provide:  MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    ],
    exports: [
        // ProductLitingComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
}) 
export class PurchaseRequestModule { }
