import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../account/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription ,  BehaviorSubject } from 'rxjs';
import { AccountLocalConstant } from '../account-locale.constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService } from '../../../shared/services/notification.service';
import { Location } from '@angular/common';
import * as _ from "lodash";
import { ModuleServices } from '../../../shared';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  // lodash: Lodash;

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

  mform: FormGroup;
  private nextUrl: any;
  private subscription: Subscription;
  hasError = false;
  isLocked:boolean = false;
  errorMessage: string;
  loginBTNClass = 'deactive-btn';
  authenticated = new BehaviorSubject(1);
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthService,
    private moduleService: ModuleServices,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private fb: FormBuilder) {
    // [Validators.required, Validators.pattern(this.email_pattern)]
    this.mform = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
 

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.subscription = this.route.queryParams.subscribe(params => {
      if (this.authService.hasValidToken()) {
        if (params['next']) {
          this.nextUrl = params['next'];
          console.log(params['next']);
          // this.router.navigate([this.nextUrl])
        } else {
          console.log('no router');
          this.router.navigate(['/dashboard'])
        }
      }
    });
  } 

  /**
   * @see ERROR_CODES ={
   * GEN_0001: 'Login Failed'
   * }
   */

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /** 
   * @param username_and_password 
   * @see to authonticate the user by passing username and password to auth service
  */
  login() {
    this.spinnerService.show();
    this.hasError = false;
    let fm = this.mform.value;
    this.authService.authenticate(fm.username, fm.password)
      .subscribe(
        token => this.onSuccess(token),
        error => this.onError(error)
      );
  }

  checkLockedAccount(username){
    this.authService.checkLockedAccount(username).subscribe((res:any)=>{
      if (res.success ==0) {
        this.isLocked = true;
      }else{
        this.isLocked=false;
      }
    })
  }

  /**
   * @see User_details
   * once the user successfully logged in then he/she to access the user details
   * @param user_id 
   * the user dirctly will be 
   */
  getUserDetails() {
    this.authService.queryUserDetails().subscribe(
      user => {
        if (user.id) {
          // console.log('getUserDetails');
          
          this.getNotificationToken();
          if (this.nextUrl) {
            this.router.navigateByUrl(this.nextUrl)
              .catch(() => this.router.navigate(['/dashboard']));
          }
          else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.hasError = true;
          console.log('wrong credentials');
        }
      });
  }
 
  getNotificationToken() {
    this.notificationService.getPermission();
    this.authService.subs[0] = this.notificationService.getNewToken().subscribe(
      (res) => {
        // console.log('login 1');
        
        localStorage.setItem('notificationToken', res.token)
        this.registerToken(res);
      },
      (err) => {
        console.log(err);
      });
  }
 
  registerToken(token) {
    if (token != null) {
      let body = new FormData();
      body.append('token', token.token);
      body.append('device_type', '3');
      this.notificationService.verifyNotificationToken(body).subscribe(
        (res) => {
          // this.refreshUnreadMessage();
        },
        (error) => {
          console.log(error);
        });
      // .unsubscribe();
    } else {
      return
    }
  }
  
  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }

  /**
   * @param res 
   * success response, logged in
   */
  private onSuccess(res) {
    let token = res;
    this.moduleService.saveName('Welcome');
    this.getUserDetails();
    this.showResponseMessage('');
    this.spinnerService.hide();
    this.authenticated.next(1);
  }

  /**
   * @param error 
   * error response or login failed
   */
  private onError(error) {
    this.spinnerService.hide();
    if (error == 'invalid_grant') {
      this.translateResponseMessage();
    } else {
    }
    this.checkLockedAccount(this.mform.value.username);
    this.resetForm();
  }
  resetForm(): void {
    this.mform = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  // refreshUnreadMessage() {
  //   var o = {isloaded:true, logout:false}
  //   this.notificationService.refreshNavBar(o)
  // }

  /**
   * get message from i18n to translate for user
   * and display bye @see showResponseMessage
   */
  private translateResponseMessage(){
    this.translateService.get([AccountLocalConstant.ERROR_LOGIN]).subscribe(
      ((res) => {
        return this.showResponseMessage(res[AccountLocalConstant.ERROR_LOGIN])
      })
    )
  }

  /**
   * @param message
   * to display messages for user according to thier request
   */
  showResponseMessage(message: string): string {
    this.hasError = true;
    return this.errorMessage = message;
  }

  forgotPassword() {
    this.router.navigate(['forgot-password']);
  }


  // showPwd(){
  //   var pwd = document.getElementById('password');
  //   pwd
  // }
}