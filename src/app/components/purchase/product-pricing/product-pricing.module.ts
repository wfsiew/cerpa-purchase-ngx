import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ProductPricingService } from './product-pricing.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PRODUCT_PRICING_ROUTES, LOOK_UP_POPUP_ROUTES} from './product-pricing.route';
import { ViewComponent } from './view.component';
import { AddProductComponent } from './vendor/add-product/add-product.component';
import { LookUpComponent } from './vendor/look-up/look-up-dialog.component';
import { ListingComponent } from './listing.component'; 
import { ComponentsModule } from '../../../shared/components/components.module';
import { ProductPricingHistoryComponent } from './product-pricing.history.component';
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
        ViewComponent,
        AddProductComponent,
        LookUpComponent,
        ListingComponent,
        ProductPricingHistoryComponent
    ],
    entryComponents: [
        // VendorInviteDialogComponent,
        LookUpComponent,
    ],
    providers: [
        ProductPricingService,
    ],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
}) 
export class ProductPricingModule { }
