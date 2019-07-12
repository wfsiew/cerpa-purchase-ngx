import { Routes } from '@angular/router';

import { ViewComponent } from './view.component';
import { AddProductComponent } from './vendor/add-product/add-product.component';
import { LookUpComponent } from './vendor/look-up/look-up-dialog.component';
import { ListingComponent } from './listing.component';
import { AuthGuardService } from '../../../account/services/auth-guard.service';
import { ProductPricingHistoryComponent } from './product-pricing.history.component';

export const PRODUCT_PRICING_ROUTES: Routes = [
    {
        path: 'product-pricing',
        component: ListingComponent,
        canActivate: [AuthGuardService],
        data: {
            authorities: [],
            pageTitle: 'product-pricing.title'
        },
    },
    {
        path: 'add-product',
        component: AddProductComponent,
        canActivate: [AuthGuardService],
        data: {
            authorities: [],
            pageTitle: 'product-pricing.title'
        }
    },
    {
        path: 'edit/:id',
        component: AddProductComponent,
        canActivate: [AuthGuardService],
        data: {
            authorities: [],
            pageTitle: 'product-pricing.title'
        }
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        canActivate: [AuthGuardService],
        data: {
            authorities: [],
            pageTitle: 'product-pricing.title'
        }
    },
    {
        path: "product-history",
        component: ProductPricingHistoryComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'look',
        component: LookUpComponent,
        canActivate: [AuthGuardService],
    }
]


export const LOOK_UP_POPUP_ROUTES: Routes = [
    {
        path: 'look_up',
        component: LookUpComponent,
        data: {
            authorities: [],
            pageTitle: 'product-pricing.title'
        },
        outlet: 'popup'
    }
];