import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { InventoryModule } from './components/inventory/inventory.module';

import { AdminModule } from './components/admin/admin.module';
import { OrderModule } from './components/order/order.module';
import { SalesModule } from './components/sales/sales.module';
import { HrmsModule } from './components/hrms/hrms.module';
import { PayableModule } from './components/payable/payable.module';
import { ReceivableModule } from './components/receivable/receivable.module';
import { LedgerModule } from './components/ledger/ledger.module';
import { ReportModule } from './components/report/report.module';
import { SearchModule } from './components/common/search/search.module';
import { AccountModule } from './components/account/account.module';
import { PurchaseModule } from './components/purchase/purchase.module';
import { ItemListingComponent } from './components/common/item-listing/item-listing.component';
import { RouterModule } from '@angular/router';
import { SharedLibsModule } from './shared/shared-libs.module';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { TOOLBAR_ROUTE } from './layout/toolbar-panel/toolbar.route';
import { AuthInterceptor, MessageService, PageStateService,
  DEFAULT_TIMEOUT, AppConstant, ModuleServices } from './shared';
import { AuthService } from './account/services/auth.service';
import { AuthGuardService } from './account/services/auth-guard.service';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatCardModule, MatIconModule,
  MatToolbarModule, MatButtonModule } from '@angular/material';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { CommonModule } from './components/common/common.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageService } from './shared/services/error.message.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from './shared/services/notification.service';
import { ConfirmDialogService } from './shared/services/confirm-dialog.service';
import { ConfirmCompleteDialogComponent } from './shared/components/confirm-complete-dialog/confirm-complete-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { DashboardModule } from './components/dashboard/dashboard.component';
import { InventoryRoleGuardServiceGuard } from './shared/services/inventory/inventory-role-guard-service.guard';
import { RaisePoDialogComponent } from './components/purchase/product-pricing/raise-po-dialog/raise-po-dialog.component';

const config = {
  apiKey: 'AIzaSyDtXP0vt8uWm6Jwrie2jRvDk3TuGwt2HH0',
  authDomain: 'cerpa-918a1.firebaseapp.com',
  databaseURL: 'https://cerpa-918a1.firebaseio.com',
  projectId: 'cerpa-918a1',
  storageBucket: 'cerpa-918a1.appspot.com',
  messagingSenderId: '888766688902'
};

@NgModule({
  declarations: [
    AppComponent,
    ItemListingComponent,
    RaisePoDialogComponent,
  ],
  imports: [
    SharedModule,
    DashboardModule,
    SharedLibsModule,
    AccountModule,
    LayoutModule,
    SearchModule,
    AdminModule,
    InventoryModule,
    OrderModule,
    SalesModule,
    ReceivableModule,
    PayableModule,
    LedgerModule,
    ReportModule,
    HrmsModule,
    PayableModule,
    CommonModule,
    AngularFireModule.initializeApp(config),
    // AngularFirestoreModule,
    AngularFireAuthModule,
    Ng4LoadingSpinnerModule.forRoot(),
    PurchaseModule,
    RouterModule.forRoot([TOOLBAR_ROUTE, ], { useHash: true, }),
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ],
  providers: [
    AuthService,
    OAuthService,
    ErrorMessageService,
    NotificationService,
    InventoryRoleGuardServiceGuard,
    AuthGuardService,
    ModuleServices,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    { provide: DEFAULT_TIMEOUT, useValue: AppConstant.NETWORK_TIME_OUT },
    MessageService,
    PageStateService,
    ConfirmDialogService,
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmCompleteDialogComponent,
    RaisePoDialogComponent
  ]
})
export class AppModule {
  constructor() {}
}
// , { useHash: true } # mm
