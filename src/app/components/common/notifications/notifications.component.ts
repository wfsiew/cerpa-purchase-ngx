import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {
  AppConstant,
  Pager,
  Pagination,
  parsePagination,
  SortOrder,
} from '../../../shared';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthService } from '../../../account/services/auth.service';
// import { Notifications } from './notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  token: string = null;
  haseToken: boolean = false;
  message
  notifyLists: any = []
  pager: number = 1;
  totalPage: number = 20;
  pageLenght: number = 0;
  sortOrder = SortOrder.ASC;
  pagesize = AppConstant.PAGE_SIZE
  pagination: Pagination;
  isListAll: boolean = false;
  refresher: string;
  @Input() showApp: string = '';
  constructor(
    private notificationServices: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: Ng4LoadingSpinnerService,
    private authService: AuthService,
    private location: Location
  ) {
    this.pagination = new Pagination();
  }

  ngOnInit() {
    if (this.authService.hasValidToken()) {      
      this.haseToken = true;
      this.spinner.show();
      this.message = this.notificationServices.currentMessage.subscribe(
        (res) => {
          this.getNotificationsList();
          this.spinner.hide();
        }
      );
      this.notificationServices.receiveMessage();
      if (this.route.snapshot.params.all === 'all') {
        this.isListAll = true
      } else {
        this.isListAll = false
      }
      this.notificationServices.currentMessage.subscribe(message => this.message = message)
    } else {
      this.haseToken = false;
      return
    }
  }

  readNotification(notifyId) {
    this.spinner.show();
    this.notificationServices.queryReadNotification(notifyId).subscribe(
      (res: any) => {
        this.notificationServices.getTotalUnreadNotifications().subscribe(
          (res: any) => {
            var ntNo = res.success;
            this.notificationServices.currentNo.next(ntNo);
            this.notificationServices.reshreshNotification(1);
          },
          (error) => {
            this.onError(error);
          });
        this.getNotificationsList();
        this.router.navigate(['notification-details', notifyId])
      },
      (error) => {
        this.onError(error)
      })
  } 

  getNotificationsList(page: number = 1) {
    this.pager = page;
    this.notificationServices.queryGetNotificationList(new Pager(this.pager, AppConstant.PAGE_SIZE)).subscribe(
      (res: any) => {
        this.onSuccess(res);
      },
      (err) => {
        this.onError(err);
      });
  }

  viewAll() {
    this.notificationServices.reshreshNotification(1);
    this.router.navigate(['notifications', 'all']);
  }

  onSuccess(res) {
    this.spinner.hide();
    this.notifyLists = res.body;
    this.pagination = parsePagination(res.headers);
  }

  onError(error) {
    this.spinner.show();
    console.log(error);
  }

  goto(ev) {
    this.getNotificationsList(ev.pageIndex + 1);
  }

  back() {
    this.location.back();
    // this.notificationServices.changeMessage(0);
    // this.router.navigate([''])
  }

}