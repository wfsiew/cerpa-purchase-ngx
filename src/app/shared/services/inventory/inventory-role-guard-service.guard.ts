import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../account/services/auth.service';
import { AppConstant } from '../../constants';
import * as _ from 'lodash';
@Injectable()
export class InventoryRoleGuardServiceGuard implements CanActivate {
  readonly Roles = AppConstant.ROLE;
  constructor(
    private authService: AuthService,
    private router: Router
    ) {}
  canActivate(
    // next: ActivatedRouteSnapshot,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const userRoles: any = JSON.parse(localStorage.getItem('userGroup'));
      let isAuthenticated = false;
      const hasToken = this.authService.hasValidToken;
      if (route.data.roles && route.data.roles.indexOf(userRoles) === -1) {
        console.log('not authenticated'); } else { console.log('authenticated'); }
      if (
        (userRoles[0].name === this.Roles.ROLE_PRODUCT_COORDINATOR
        || userRoles[0].name === this.Roles.ROLE_PRODUCT_MANAGER
        || userRoles[0].name === this.Roles.ROLE_STOCK_OBSERVER)
        && hasToken) {
          isAuthenticated = true;
        } else {
          isAuthenticated = false;
          this.router.navigate(['/dashboard']);
        }
    return isAuthenticated;
  }
}
