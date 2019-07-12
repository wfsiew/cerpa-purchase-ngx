import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventEmitter } from "@angular/core";


export class RefreshNav{
  constructor(public isloaded:boolean, logout:boolean, data:any){}
}
 
@Injectable()
export class ErrorMessageService {
  public refrishNav$: EventEmitter<RefreshNav>;

  baseUrl = `${environment.baseUrl}/api/purchase/notifications`;
  registerUrl = `${this.baseUrl}/register`;
 

  header = new HttpHeaders();

  private errorMessageSource = new BehaviorSubject(null);
  currentMessage = this.errorMessageSource.asObservable();

  
  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  constructor(
    private http: HttpClient
  ) {
    this.refrishNav$ = new EventEmitter();
  }
  
  changeMessage(error) {
    if (error !=null) {
      this.errorMessageSource.next(error);
    }
  }
 
}
