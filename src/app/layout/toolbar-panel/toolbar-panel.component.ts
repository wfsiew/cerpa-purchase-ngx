import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { NotificationService } from '../../shared/services/notification.service';
import { Pager, AppConstant, PageStateService, ModuleServices } from '../../shared';
import { AuthService } from '../../account/services/auth.service';
import { NotificationsComponent } from '../../components/common';
import { LoginComponent, UserProfileComponent } from '../../components/account';
import { Router } from '@angular/router';
import { ModulePanelComponent } from '../module-panel/module-panel.component';

@Component({
  selector: 'app-toolbar-panel',
  templateUrl: './toolbar-panel.component.html',
  styleUrls: ['./toolbar-panel.component.css'],
})

export class ToolbarPanelComponent implements OnInit {
  @Output() toggleLeftSidenav: EventEmitter<any> = new EventEmitter();
  @Output() closeLeftSidenav: EventEmitter<any> = new EventEmitter();
  @Output() toggleRightSidenav: EventEmitter<any> = new EventEmitter();
  @Output() refreshModule = new EventEmitter<string>();
  @ViewChild(NotificationsComponent) child;
  @Input() childMessage: string;

  showApp: String;
  showCommonMenu: String;
  softwareName: String;
  moduleName: String;
  isUserLogin = false;
  notifyNo: any = 0;
  showBage = false;
  showToolbar = true;
  constructor(
    iconRegistry: MatIconRegistry,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private moduleService: ModuleServices,
    sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/thumbup-icon.svg'));
    this.softwareName = 'CERPA';
  }
  ngOnInit() {
    this.authService.authenticated.subscribe(res => {
      if (!this.authService.hasValidToken()) {
        this.isUserLogin = false;
        this.showToolbar = false;
      } else {
        // this.toggleRightSidenav.emit(null);
        this.isUserLogin = true;
      }
      if (res === 1) {
        this.moduleName = this.moduleService.getModelName();
        this.getNotificationNo({ isloaded: true });
        this.notificationService.currentNo.subscribe(num => {
          this.setNotificationNo(num);
        });
      }
      if (res === 9) {
        this.isUserLogin = false;
        this.setNotificationNo(0);
      }
    });

    this.notificationService.currentRefresher.subscribe((res) => {
      if (res === 1) {
        this.toggleRightSidenav.emit('close-right-sidenav');
      }
    });
  }


  handleToggleLeftSidenav() {
    this.toggleLeftSidenav.emit('toggle-left-sidenav');
    this.refreshModule.emit(null);
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

  getNotificationNo(data) {
    this.notificationService.currentMessage.subscribe(
      (res) => {
        this.notificationService.getTotalUnreadNotifications().subscribe((resp: any) => {
          this.notifyNo = resp.success;
          this.notificationService.currentNo.next(this.notifyNo);
          this.setNotificationNo(this.notifyNo);
        });
      }
    );

  }

  setNotificationNo(nto: number) {
    this.notifyNo = nto;
    if (this.notifyNo > 0) {
      this.showBage = true;
      if (this.notifyNo > 9) {
        this.notifyNo = '9+';
      } else {
        return this.notifyNo
      }
    } else {
      this.showBage = false;
    }
  }

  refreshApp(){
    this.router.navigate(['dashboard']);
    this.moduleService.saveName('Welcome');
    this.moduleName = this.moduleService.getModelName();
    this.closeLeftSidenav.emit('close-left-sidenav');
  }

}
