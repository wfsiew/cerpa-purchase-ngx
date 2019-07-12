import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { VendorModule } from './vendor/vendor.module';
import { ProductPricingModule } from './product-pricing/product-pricing.module';
import { SharedModule } from '../../shared/shared.module';
import { PurchaseRequestModule } from './purchase-request/purchase-request.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';

@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
      VendorModule,
      SharedModule,
      ProductPricingModule,
      PurchaseOrderModule,
      PurchaseRequestModule,
    ],
    declarations: [],
    entryComponents: [],
    providers: [
    ],
    exports: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PurchaseModule {}
