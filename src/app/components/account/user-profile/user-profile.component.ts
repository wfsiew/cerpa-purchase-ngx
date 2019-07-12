import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuardService } from '../../../account/services/auth-guard.service';
import { AuthService } from '../../../account/services/auth.service';
import { LogoutComponent } from '../logout';
import { MatDialog } from '@angular/material';
import { AccountService } from '../service';
import { AppConstant, PageStateService } from '../../../shared';
import { UpdateUserProfileComponent } from './update-user-profile.component';
import { NotificationsComponent } from '../../common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails:any;
  userRole: any;
  @ViewChild(ChangePasswordComponent) cardChangePassword : ChangePasswordComponent;
  @ViewChild(LogoutComponent)logoutUser: LogoutComponent;
  msg:string = '';

  @Output() toggleLeftSidenav: EventEmitter<any> = new EventEmitter();
  @Output() toggleRightSidenav: EventEmitter<any> = new EventEmitter();
  @Output() closeLeftSidenav: EventEmitter<any> = new EventEmitter();
  @ViewChild(NotificationsComponent) child;
  @Input() childMessage: string;
  current_img:string = 'assets/images/default-m-icon/default-m-icon.png';

  @Input() showApp: string = '';
  isEditable:boolean = false;
  s:boolean=false;
  constructor(
    private spinner: Ng4LoadingSpinnerService,
    // private route: ActivatedRoute,
    private dialog: MatDialog,
    // private authGuardService: AuthGuardService,
    private authService: AuthService,
    private pageService: PageStateService,
    private accountService: AccountService,
    // private notificationServices: NotificationService,
  ) {}
  
  ngOnInit() {   
   if (this.authService.hasValidToken()) {
    this.getUserDetails();
   }else{
     return
   }
   
  this.authService.authenticated.subscribe(res => {
    this.getUserDetails();
    this.s =true;
  });
  if (this.s) {
    this.getUserRole()
  }
  this.isEditable = this.pageService.isEditable;
  }

  handleToggleLeftSidenav() {
    this.toggleLeftSidenav.emit('toggle-left-sidenav');
  }
  handleToggleRightSidenav($menu) {
    this.toggleRightSidenav.emit($menu);
  }
  openRightSidenav($menu) {
    this.toggleRightSidenav.emit('open-right-sidenav-' + $menu);
    
  }
  closeRightSidenav() {
    this.toggleRightSidenav.emit('close-right-sidenav');
  }

  getUserRole(){
    this.authService.queryUserDetails().subscribe((res)=>{
      this.userRole = res.groups;
    })
  }

  editProfile(){
    this.handleToggleLeftSidenav();
    this.handleToggleRightSidenav('Notifications') 
    this.toggleLeftSidenav.emit('toggle-left-sidenav');
    this.openRightSidenav('toggle-left-sidenav')
    this.closeRightSidenav();

    this.isEditable = !this.isEditable;
    this.pageService.isEditable = this.isEditable;
    const dialogRef = this.dialog.open(UpdateUserProfileComponent, {
      width: '500px',
      height: '600px',
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getUserDetails();
    });
  }
  getUserDetails(){
      this.accountService.queryGetUserDetails().subscribe((res:any)=>{
        if (res.picture !=null || res.picture !=undefined) {
          this.current_img = res.picture;
        }
       this.userDetails = res;
    })
  }

  changePassword(){
      const dialogRef = this.dialog.open(ChangePasswordComponent, {
        width: '500px',
        height: '450px',
        data: 12
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getUserDetails();
      });
  }
  // userprofileAction: String; 
  // username: String = 'Joe Lim';
  // userrole: String = 'Store Manager';

  closeChangePasswordCard() {
    this.cardChangePassword.cardStatus = 'close';
  }

  openChangePasswordCard() {
    this.cardChangePassword.cardStatus = 'open';
  }
  
}
