import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PRODUCT_PRICING_ROUTES, LOOK_UP_POPUP_ROUTES} from './purchase-order.route';
import { IssuePurchaseOrderComponent } from './issue-po.component'; 
import { ComponentsModule } from '../../../shared/components/components.module';
import { PurchaseOrderService } from './purchase-order.service';
import { LookUpComponent } from './look-up';

import { MAT_DIALOG_DEFAULT_OPTIONS, MatTableModule } from '@angular/material';
import { PurchaseOrderComponents } from './purchase-order.component';
import { ViewPurchaseOrderComponent } from './view-po.component';
import { DeliveryStatusComponent } from './delivery-status/delivery-status.component';
import { DeliveryOrderComponent } from './delivery-order.component';
import { InvoiceDeliveryOrderComponent } from './invoice-do.component';
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
        IssuePurchaseOrderComponent,
        PurchaseOrderComponents,
        ViewPurchaseOrderComponent,
        DeliveryOrderComponent,
        InvoiceDeliveryOrderComponent,
        ViewPurchaseOrderComponent,
        DeliveryStatusComponent
    ],
    entryComponents: [
        LookUpComponent,
    ],
    providers: [
        PurchaseOrderService,
        {provide:  MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    ],
    exports: [
        // ProductLitingComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
}) 
export class PurchaseOrderModule { }
