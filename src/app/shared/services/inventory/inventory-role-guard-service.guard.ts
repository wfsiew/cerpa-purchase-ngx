import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../account/services/auth.service';
import { AppConstant } from '../../constants';
import * as _ from 'lodash';
@Injectable()
export class InventoryRoleGuardServiceGuard implements CanActivate {
  readonly Roles = AppConstant.ROLE;
  constructor (
    private authService: AuthService,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const userRoles: any = JSON.parse(localStorage.getItem('userGroup'));
    let isAuthenticated = false;
    const hasToken = this.authService.hasValidToken;
    const s = _.some(userRoles, (value, i, ls) => {
      const b = _.findIndex(route.data.roles, (k) => {
        return k === value.name;
      });
      return b >= 0;
    });
    if (s && hasToken) {
      isAuthenticated = true;
    } else {
      isAuthenticated = false;
      this.router.navigate(['/dashboard']);
    }
    return isAuthenticated;
  }
}
