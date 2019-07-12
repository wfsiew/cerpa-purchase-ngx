import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { environment } from '../../../environments/environment';
import { Group, User } from '..';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {
  private baseUrl = environment.baseUrl;
  private tokenUrl = this.baseUrl + '/o/token/';
  private userDetailsUrl = this.baseUrl + '/api/cerpa-admin/current-user/';
  private token: string;
  private user: User;
  notify: Subject<boolean> = new Subject<boolean>();
  authenticated = new BehaviorSubject(0);
  subs = [];

  constructor(private http: HttpClient) {}

  hasGroup(lookupGroup: string): boolean {
    if (this.user == null) {
      return false;
    }
    if (this.user.groups != null) {
      const group: Group = this.user.groups.find(k => k.name === lookupGroup);
      if (group != null) {
        return true;
      }
    }
    return false;
  }

  getToken(): string {
    return localStorage.getItem('token');
    // return this.token;
  }

  getExpiry(): number {
    const x = localStorage.getItem('expires');
    if (x == null) {
      return 0;
    }
    return Number(x);
  }

  getRefreshToken(): string {
    return localStorage.getItem('refresh_token');
  }

  refreshToken(): Observable<string> {
    if (!this.getRefreshToken()) {
      this.clear();
      return Observable.of(null);
    }

    // console.log('=== refresh-token ===', this.getRefreshToken());

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    const body = new HttpParams()
      .set('refresh_token', this.getRefreshToken())
      .set('client_id', 'ElHqJ96DlTJ93uOVBr5Bgmf2pBiojpaGbrQm5dsp')
      .set('grant_type', 'refresh_token');
    return this.http.post(this.tokenUrl, body.toString(), httpOptions)
      .map((res: HttpResponse<any>) => this.extractToken(res))
      .catch(e => this.handleError(e));
  }

  authenticate(username: string, password: string): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('client_id', 'ElHqJ96DlTJ93uOVBr5Bgmf2pBiojpaGbrQm5dsp')
      .set('grant_type', 'password');
    return this.http.post(this.tokenUrl, body.toString(), httpOptions)
      .map((res: HttpResponse<any>) => this.extractToken(res))
      .catch(e => this.handleError(e));
  }

  handleError(e): string {
    if (e.status && (e.status === 401 || e.status === 403)) {
      return;
    }
    throw ('invalid_grant');
  }

  hasValidToken(): boolean {
    return !!this.getToken();
  }

  isTokenExpired(): boolean {
    let expired = false;
    if (this.getExpiry() == null) {
      return expired;
    }
    expired = this.getExpiry() < new Date().getTime();
    return expired;
  }

  clear(): void {
    localStorage.clear();
  }

  unregisterNotificationToken(token: string): Observable<object> {

    const body = new FormData();
    body.append('token', token);
    return this.http.post(`${this.baseUrl}/api/purchase/notifications/unregister`, body);
  }

  private extractToken(res: any): string {
    localStorage.setItem('token', res.access_token);
    localStorage.setItem('refresh_token', res.refresh_token);
    const exp = res.expires_in;
    const dt = new Date();
    dt.setTime(dt.getTime() + exp * 1000);
    localStorage.setItem('expires', dt.getTime().toString());
    if (res.access_token === null || res.refresh_token === null || res.expires_in === null) {
      return this.handleError(res);
    } else {
      return this.token = res.access_token;
    }
  }

  getUser(): User {
    return this.user;
  }

  queryUserDetails(): Observable<User> {
    return this.http.get(this.userDetailsUrl)
      .map((res: any) => {
        const entity: User = Object.assign(new User(), res);
        this.user = entity;
        this.authenticated.next(1);
        localStorage.setItem('currentUserEmail', res.email);
        localStorage.setItem('userGroup', JSON.stringify(this.user.groups));
        return entity;
      });
  }
  onNotify(event) {
    // console.log();
    return this.notify.next(true);
  }

  logOut(token): Observable<object> {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/x-www-form-urlencoded'
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    const body = new FormData();
    body.append('token', token);
    const clientId = {
      purchasing: 'ElHqJ96DlTJ93uOVBr5Bgmf2pBiojpaGbrQm5dsp',
      inventory: '0CpdlwEZFpnozEPOGUH5BJKqIbsa1PV7q0QO86Y0'};
    body.append('client_id', clientId.inventory);
    this.authenticated.next(9);
    return this.http.post(`${this.baseUrl}/o/revoke_token/`, body);
  }

  checkLockedAccount(username): Observable<object> {
    return this.http.get(`${this.baseUrl}/api/cerpa-admin/user/fail-count?username=${username}`);
  }
}
