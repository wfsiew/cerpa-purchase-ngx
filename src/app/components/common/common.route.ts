import { Routes } from '@angular/router';
import { AuthGuardService } from '../../account/services/auth-guard.service';
import { NotificationsComponent } from './notifications';
import { NotificationsDetailsComponent } from './notifications/notifications-details.component';

export const CommontRoute: Routes = [
    {
        path: 'notification-details/:id',
        component: NotificationsDetailsComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'notifications/:all',
        component: NotificationsComponent,
        canActivate: [AuthGuardService]
    }
];
