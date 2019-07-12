import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../account/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  messaging = firebase.messaging()
  // logoutUser:boolean = true;
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
  ) { }

  ngOnInit() { }

  deleteTokenNotification() {
    this.spinnerService.show();
    var notificationToken = localStorage.getItem('notificationToken');
    this.authService.unregisterNotificationToken(notificationToken)
      .subscribe((res) => {
        this.deleteNotificationToken(notificationToken);
        this.spinnerService.hide();
      }, (err) => {
        this.onError(err);
      })
  }

  deleteNotificationToken(token) {
    this.messaging.deleteToken(token).then(function (res) {
      
    }).catch(function (error) {
      console.log("Error", error);
    });
  }

  revokeToken() {
    this.spinnerService.show();
    var token = localStorage.getItem('token');
    this.authService.logOut(token).subscribe((res) => {
      this.authService.clear();
      // this.logoutUser = false;
      this.notificationService = null;
      this.spinnerService.hide();
      // this.router.navigate(['/login'])
      window.location.replace('')
    }, (err) => {
      this.onError(err);
    })
  }

  logout() {
    var token = localStorage.getItem('token');
    var NotificationToken = localStorage.getItem('notificationToken');
    if (this.authService.subs.length > 0) this.authService.subs[0].unsubscribe();
    this.revokeToken();
    this.deleteTokenNotification();
    if (!this.authService.hasValidToken) {
      this.authService.authenticate('', '').subscribe().unsubscribe();
    }
  }

  onError(err) {
    console.log(err);
    this.spinnerService.hide();
  }
}
