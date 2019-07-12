import { Routes } from '@angular/router';
import { IssuePurchaseRequestComponent } from './issue-pr.component';
import { AuthGuardService } from '../../../account/services/auth-guard.service';
import { LookUpComponent } from '../product-pricing';
import { PurchaseRequestListComponent } from './p-request-list.component';
import { ViewPurchaseRequestComponent } from './view-pr.component';

export const PRODUCT_PRICING_ROUTES: Routes = [
    {
        path: 'issue-pr',
        component: IssuePurchaseRequestComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'edit-pr/:id',
        component: IssuePurchaseRequestComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'view-pr/:id/:p',
        component: ViewPurchaseRequestComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'purchase-request',
        component: PurchaseRequestListComponent,
        canActivate: [AuthGuardService],
    }
];

export const LOOK_UP_POPUP_ROUTES: Routes = [
    {
        path: 'look_up',
        component: LookUpComponent,
        canActivate: [AuthGuardService],
        data: {
            authorities: [],
            pageTitle: 'product-pricing.title'
        },
        outlet: 'popup'
    }
];
