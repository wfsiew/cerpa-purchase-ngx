import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
import { BehaviorSubject ,  Observable, Subject } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Pager } from '../models';
import { createRequestParams } from '../utils';
import { environment } from '../../../environments/environment';
import { EventEmitter } from "@angular/core";

@Injectable()
export class NotificationService {

  baseUrl = `${environment.baseUrl}/api/purchase/notifications`;
  registerUrl = `${this.baseUrl}/register`;
 

  private refreshSource = new BehaviorSubject(0);
  currentRefresher = this.refreshSource.asObservable();

  header = new HttpHeaders();
  private newToken = new Subject<any>();
  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(0) // message source
  currentNo = new BehaviorSubject(0);
  
  
  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient
  ) {
    // this.refrishNav$ = new EventEmitter();
    this.receiveMessage();
    this.getPermission();
  }

 
  updateToken(token) {
    return this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (!user) return;
      const data = { [user.uid]: token }
    })
  }

  getPermission(){
    this.messaging.requestPermission()
      .then(() => {
        return this.messaging.getToken()
      })
      .then(token => {
        this.newToken.next({ token: token });
        this.updateToken(token);
      })
      .catch((err) => {        
        console.log('Unable to get permission to notify.', err);
      });
  } 
    
  reshreshNotification(message) {
    this.refreshSource.next(message)
  }

  deleteToken(token) {
    this.messaging.deleteToken(token).then(function(res) {
    }).catch(function(error) {
      console.log("Error", error);
    });
  }
  
  receiveMessage() {
    this.messaging.onMessage((payload) => {
      this.currentMessage.next(payload);
    });
  }

  getNewToken(): Observable<any> {
    return this.newToken.asObservable();
  }

  /**
   * Register Notification token 
   */
  verifyNotificationToken(data): Observable<object> {
    return this.http.post(`${this.baseUrl}/register`,data);
  }
  
  /**
   * @param page 
   */
  queryGetNotificationList(page: Pager): Observable<object> {
    const httpParams: HttpParams = createRequestParams(page);
    return this.http.get(`${this.baseUrl}?`, { params: httpParams, observe: 'response', headers: this.headers })
  } 
 
  queryReadNotification(id): Observable<object> {
    return this.http.put(`${this.baseUrl}/${id}`, id);
  }

  getNotificationsDetails(id: number): Observable<object> {
    const httpParams: HttpParams = createRequestParams();
    return this.http.get(`${this.baseUrl}/${id}`,
      {
        params: httpParams,
        observe: 'response',
        headers: this.headers
      })
  }
 
  getTotalUnreadNotifications(): Observable<object> {
    return this.http.get(`${this.baseUrl}/unread`);
  }
}
