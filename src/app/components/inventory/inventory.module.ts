import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { InventoryComponent } from './inventory.component';
import { ListMaterialComponent } from './material/list-material/list-material.component';
import { MaterialStockComponent } from './material/material-stock/material-stock.component';
import { ModifyMaterialComponent } from './material/modify-material/modify-material.component';
import { MaterialComponent } from './material/material.component';
import { NewMaterialComponent } from './material/new-material/new-material.component';
import { ViewMaterialComponent } from './material/view-material/view-material.component';
import { ProductComponent } from './product/product.component';
import { INVENTORY_ROUTES } from './inventory.route';
import { AddProductComponent } from './product/add-product.component';
import { InventoryService } from './inventory.service';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from '../purchase/vendor/vendor.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NewProductBatchComponent } from './new-product-batch.component';
import { ComponentsModule } from '../../shared/components/components.module';
import { BatchListingComponent } from './batch-listing.component';
import { ProductListingComponent } from './product-listing.component';
import { InventoryPageService, BatchesPageService } from '../../shared/services/inventory/inventory-state.service';
import { MessageDialogComponent } from '../../shared/components/message-dialog';
import { ViewProductComponent } from './product/view-product.component';

@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
      SharedModule,
      ComponentsModule,
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
        }
    }),
      RouterModule.forChild(INVENTORY_ROUTES)
    ],
    declarations: [
      InventoryComponent,
      ListMaterialComponent,
      MaterialStockComponent,
      ModifyMaterialComponent,
      MaterialComponent,
      NewMaterialComponent,
      ViewMaterialComponent,
      AddProductComponent,
      ProductComponent,
      NewProductBatchComponent,
      BatchListingComponent,
      ProductListingComponent,
      ViewProductComponent
    ],
    entryComponents: [
      MessageDialogComponent
    ],
    providers: [
      InventoryPageService,
      InventoryService,
      BatchesPageService,
    ],
    exports: [
      InventoryComponent,
      ListMaterialComponent,
      MaterialStockComponent,
      ModifyMaterialComponent,
      MaterialComponent,
      NewMaterialComponent,
      ViewMaterialComponent,
      ProductComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InventoryModule {}
