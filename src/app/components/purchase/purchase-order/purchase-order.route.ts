import { Routes } from '@angular/router';
import { IssuePurchaseOrderComponent } from './issue-po.component';
import { AuthGuardService } from '../../../account/services/auth-guard.service';
import { LookUpComponent } from '../product-pricing';
import { PurchaseOrderComponents } from './purchase-order.component';
import { ViewPurchaseOrderComponent } from './view-po.component';
import { DeliveryStatusComponent } from './delivery-status/delivery-status.component';
import { DeliveryOrderComponent } from './delivery-order.component';
import { InvoiceDeliveryOrderComponent } from './invoice-do.component';

export const PRODUCT_PRICING_ROUTES: Routes = [
    { 
        path: 'purchase-order',
        component: PurchaseOrderComponents,
        canActivate: [AuthGuardService],
    },
    {
        path: 'issue-po/:id', 
        pathMatch: "full",
        component: IssuePurchaseOrderComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'issue-po/:id/:saved/:saveId',
        component: IssuePurchaseOrderComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'view-po/:id/:p',
        component: ViewPurchaseOrderComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'delivery-order/:id',
        component: DeliveryOrderComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'invoice-do/:id',
        component: InvoiceDeliveryOrderComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'invoice-do/:id/:inv',
        component: InvoiceDeliveryOrderComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'delivery-status/:id',
        component: DeliveryStatusComponent,
        canActivate: [AuthGuardService],
    }
];

export const LOOK_UP_POPUP_ROUTES: Routes = [
    {
        path: 'look_up',
        component: LookUpComponent,
        // canActivate: [AuthGuardService],
        data: {
            authorities: [],
            pageTitle: 'product-pricing.title'
        },
        outlet: 'popup'
    }
];
