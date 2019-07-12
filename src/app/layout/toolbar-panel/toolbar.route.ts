import { Route, Routes } from '@angular/router';

import { ToolbarPanelComponent } from './toolbar-panel.component';
import { LoginComponent } from '../../components/account';

export const TOOLBAR_ROUTE: Route = {
    path: '',
    component: ToolbarPanelComponent,
    outlet: 'toolbar'
};
