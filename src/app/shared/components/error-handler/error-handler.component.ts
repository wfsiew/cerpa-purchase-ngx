import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorMessageService } from '../../services/error.message.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConstant } from '../../constants';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-error',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.css']
})

export class errorHandlerComponent implements OnInit, OnDestroy {
  errorMessage: any = '';
  httpSubscription: ISubscription;

  constructor(
    private errorMessageService: ErrorMessageService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    console.log('test');
    this.httpSubscription = this.errorMessageService.currentMessage
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res != undefined && res.error == ErrorType.GLOBAL_RROR) {
            console.log('G_ERROR')
            this.errorMessage = "Server error please try again";
          } else if (res != undefined && res.error == ErrorType.TIME_OUT_ERROR) {
            console.log('T_ERROR');
            this.errorMessage = "Network Error";
          }
          else if (res != undefined) {
            if (res.error != undefined) {
              console.log('has error');
              var er = res.error.error;
              this.translateService.get(`${AppConstant.ERROR_CODE_URL}.${er}`).subscribe((res) => {
                this.errorMessage = res;
              })
            } 
            else if (res.error.error != undefined) {
              console.log('has error');
              var er = res.error.error;
              this.translateService.get(`${AppConstant.ERROR_CODE_URL}.${er}`).subscribe((res) => {
                this.errorMessage = res;
              })
            } else {
              this.errorMessage = "Network error please try again";
            }
          } else {
            this.errorMessage = "Server error please try again";
          }
        })
  }

  ngOnDestroy() {
    this.httpSubscription.unsubscribe();
  }
}

export enum ErrorType {
  GLOBAL_RROR = 'G_RROR',
  TIME_OUT_ERROR = "T_ERROR",
  HANDLED_ERROR = "H_RRROR"
}

