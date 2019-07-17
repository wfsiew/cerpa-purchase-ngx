import { Routes } from '@angular/router';

import { InventoryComponent, MaterialComponent, ListMaterialComponent, MaterialStockComponent } from '.';

import { AuthGuardService } from '../../account/services/auth-guard.service';
import { AddProductComponent } from './product/add-product.component';
import { InventoryRoleGuardServiceGuard } from '../../shared/services/inventory/inventory-role-guard-service.guard';
import { AppConstant } from '../../shared';
import { NewProductBatchComponent } from './new-product-batch.component';
import { BatchListingComponent } from './batch-listing.component';
import { ProductListingComponent } from './product-listing.component';
import { ViewProductComponent } from './product/view-product.component';

export const INVENTORY_ROUTES: Routes = [
  {
    path: 'inventory',
    component: ProductListingComponent,
    canActivate: [InventoryRoleGuardServiceGuard],
    data: {
      authorities: [],
      roles: [
        AppConstant.ROLE.ROLE_PRODUCT_MANAGER,
        AppConstant.ROLE.ROLE_PRODUCT_COORDINATOR,
        AppConstant.ROLE.ROLE_STOCK_OBSERVER
      ],
      pageTitle: 'inventory.title'
    }
  },
  {
    path: 'material',
    component: MaterialComponent,
    canActivate: [InventoryRoleGuardServiceGuard],
    data: {
      authorities: [],
      pageTitle: 'material.title'
    }
  },
  {
    path: 'materials',
    component: ListMaterialComponent,
    canActivate: [InventoryRoleGuardServiceGuard],
    data: {
      authorities: [],
      pageTitle: 'material.title'
    }
  },
  {
    path: 'new-product',
    component: AddProductComponent,
    canActivate: [InventoryRoleGuardServiceGuard],
    data: {
      roles: [AppConstant.ROLE.ROLE_PRODUCT_MANAGER],
      authorities: [],
      pageTitle: 'material.title'
    }
  },
  {
    path: 'view-product/:id',
    component: ViewProductComponent,
    canActivate: [InventoryRoleGuardServiceGuard],
    data: {
      roles: [
        AppConstant.ROLE.ROLE_STOCK_OBSERVER,
        AppConstant.ROLE.ROLE_PRODUCT_COORDINATOR
      ],
      authorities: [],
      pageTitle: 'material.title'
    }
  },
  {
    path: 'edit-product/:id',
    component: AddProductComponent,
    canActivate: [InventoryRoleGuardServiceGuard],
    data: {
      roles: [AppConstant.ROLE.ROLE_PRODUCT_MANAGER],
      authorities: [],
      pageTitle: 'material.title'
    }
  },
  {
    path: 'material-stock',
    component: MaterialStockComponent,
    canActivate: [InventoryRoleGuardServiceGuard],
    data: {
      authorities: [],
      pageTitle: 'material.title'
    }
  },
  {
    path: 'batch-list/:id/:productName',
    component: BatchListingComponent,
    canActivate: [InventoryRoleGuardServiceGuard],
    data: {
      roles: [
        AppConstant.ROLE.ROLE_PRODUCT_MANAGER,
        AppConstant.ROLE.ROLE_PRODUCT_COORDINATOR,
        AppConstant.ROLE.ROLE_STOCK_OBSERVER
      ],
      authorities: [],
      pageTitle: 'material.title'
    }
  },
  {
    path: 'product-list',
    component: ProductListingComponent,
    canActivate: [InventoryRoleGuardServiceGuard],
    data: {
      roles: [
        AppConstant.ROLE.ROLE_PRODUCT_MANAGER,
        AppConstant.ROLE.ROLE_PRODUCT_COORDINATOR,
        AppConstant.ROLE.ROLE_STOCK_OBSERVER
      ],
      authorities: [],
      pageTitle: 'material.title'
    }
  },
  {
    path: 'edit-batch/:prd_id/:id/:productName',
    component: NewProductBatchComponent,
    canActivate: [InventoryRoleGuardServiceGuard],
    data: {
      roles: [
        AppConstant.ROLE.ROLE_PRODUCT_MANAGER,
        AppConstant.ROLE.ROLE_PRODUCT_COORDINATOR,
      ],
      authorities: [],
      pageTitle: 'material.title'
    }
  },
  {
    path: 'view-batch/:prd_id/:id/:productName',
    component: NewProductBatchComponent,
    canActivate: [InventoryRoleGuardServiceGuard],
    data: {
      roles: [
        AppConstant.ROLE.ROLE_STOCK_OBSERVER
      ],
      authorities: [],
      pageTitle: 'material.title'
    }
  },
  {
    path: 'add-batch/:prd_id/:productName',
    component: NewProductBatchComponent,
    canActivate: [InventoryRoleGuardServiceGuard],
    data: {
      roles: [
        AppConstant.ROLE.ROLE_PRODUCT_MANAGER,
        AppConstant.ROLE.ROLE_PRODUCT_COORDINATOR,
        AppConstant.ROLE.ROLE_STOCK_OBSERVER
      ],
      authorities: [],
      pageTitle: 'material.title'
    }
  }
];
