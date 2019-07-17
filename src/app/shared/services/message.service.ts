import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

@Injectable()
export class MessageService {

  private subject = new Subject<any>();

  constructor() { }
   
  sendMessage(message: string, data: any) {
    this.subject.next({ name: message, data: data });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
} 
