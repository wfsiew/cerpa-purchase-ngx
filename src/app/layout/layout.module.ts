import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatToolbarModule, 
  MatGridListModule, 
  MatSidenavModule,
  MatCardModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule } from '@angular/material';

import { FooterPanelComponent } from './footer-panel/footer-panel.component';
import { ModulePanelComponent } from './module-panel/module-panel.component';
import { ToolbarPanelComponent } from './toolbar-panel/toolbar-panel.component';
import { SearchModule } from '../components/common/search/search.module';
import { CommonModule } from '../components/common/common.module';
import { InventoryModule } from '../components/inventory/inventory.module';
import { PurchaseModule } from '../components/purchase/purchase.module';
import { SharedModule } from '../shared/shared.module';
import { AccountModule } from '../components/account/account.module';

@NgModule({
    imports: [
      MatToolbarModule,
      MatGridListModule,
      MatSidenavModule,
      MatCardModule,
      MatListModule,
      MatMenuModule,
      MatSelectModule,
      MatTableModule,
      MatCheckboxModule,
      MatPaginatorModule,
      BrowserAnimationsModule,
      SearchModule,
      AccountModule,
      CommonModule,
      InventoryModule,
      PurchaseModule,
      SharedModule,
      RouterModule
    ],
    declarations: [
      FooterPanelComponent,
      ModulePanelComponent,
      ToolbarPanelComponent,
    ],
    entryComponents: [],
    providers: [],
    exports: [
      FooterPanelComponent,
      ModulePanelComponent,
      ToolbarPanelComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule {}
