import { Route } from '@angular/router';

import { HrmsComponent } from './hrms.component';

export const HRMS_ROUTE: Route = {
    path: 'hrms',
    component: HrmsComponent,
    data: {
        authorities: [],
        pageTitle: 'hrms.title'
    }
};