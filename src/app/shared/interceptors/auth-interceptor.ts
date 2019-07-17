
import {empty as observableEmpty, throwError as observableThrowError,  Observable ,  BehaviorSubject, TimeoutError } from 'rxjs';

import {take, filter, catchError, switchMap, finalize,  timeout } from 'rxjs/operators';
import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../account/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConstant } from '../constants';
import { ErrorMessageService } from '../services/error.message.service';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number,
    private authService: AuthService,
    private translateService: TranslateService,
    private errorMessageService: ErrorMessageService,
    private router: Router) {
  } 

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.mapErrorMessges({ error: null });
    request = this.applyCredentials(request, this.authService.getToken());
    const timeoutValue = Number(request.headers.get('timeout')) || this.defaultTimeout;
    return next.handle(request)
      .pipe(timeout(AppConstant.NETWORK_TIME_OUT)).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          console.log('error instanceof HttpErrorResponse');
          this.mapErrorMessges(error);
          if (!window.navigator.onLine) {
            this.authService.onNotify(true)
          }
          else {
            switch ((<HttpErrorResponse>error).status) {
              case 401:
              case 403:
                return this.handle401Error(request, next);
              case 403:
                return this.handle401Error(request, next);
            }
            return observableThrowError(error);
          }

        }
        else {
          this.mapErrorMessges({error:'G_ERROR'});
          return observableThrowError(error);
        }
      }));
  }
 
  applyCredentials(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.authService.getRefreshToken()) {
      console.log('refresh token is null');
      return this.logoutUser(req, next);
    }
    if (!this.isRefreshingToken) {
      console.log('entercept error 2');
      this.isRefreshingToken = true;
      this.tokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: string) => {
          if (token) {
            this.tokenSubject.next(token);
            return next.handle(this.applyCredentials(req, token));
          }
          console.log('refreshToken return null')
          return this.logoutUser(req, next);
        }),
        catchError(error => {
          console.log('refreshToken error')
          return this.logoutUser(req, next);
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        }),);
    }

    else {
      console.log('entercept error 3');
      if (this.tokenSubject.value == null) {
        console.log('no subject token')
        return this.logoutUser(req, next);
      }

      return this.tokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.applyCredentials(req, token));
        }),);
    }
  }

  logoutUser(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('=== logoutUser ===');
    this.authService.clear();
    this.authService.handleError(req);
    this.router.navigate(['/login']);
    //this.events.publish(AppConstant.EVENT_USER_LOGOUT);
    return observableEmpty();
  }

  mapErrorMessges(error) {
    if (error.error == 'common') {
      return this.errorMessageService.changeMessage(error)
    }
    else if (error.error != null || error.error != undefined) {
      return this.errorMessageService.changeMessage(error)
    }
    else {
      return
    }
  }
}