import { Component, ViewChild, OnInit } from '@angular/core';
import { Input, Output } from '@angular/core';
import { ModulePanelComponent } from './layout/module-panel/module-panel.component';
import { MatSidenav, MatDialog } from '@angular/material';
import { ToolbarPanelComponent } from './layout/toolbar-panel/toolbar-panel.component';
import { OAuthService } from 'angular2-oauth2/oauth-service';
// import { Sysinfo } from './models/sysinfo'; 



import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './account/services/auth.service';
import { ConfirmDialogComponent } from './shared/components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // providers: [ Sysinfo ],
})
export class AppComponent {
  @ViewChild(ModulePanelComponent) appModulePanel: ModulePanelComponent;
  @ViewChild(ToolbarPanelComponent) appToolbarPanel: ToolbarPanelComponent;
  navEvent = null;
  is404 = false;
  reTry_url = '/';
  constructor(private authService: AuthService,
    private dialog: MatDialog
    ) {
    this.authService.notify.subscribe((res: boolean) => {
      this.refershNetwork();
      // this.reTry_url = window.location.href;
      // return this.is404 = res;
    });
  }


  toggleLeftSidenav($event) {
    this.appModulePanel.leftsidenav.toggle();
  }
  closeLeftSidenav($event) {
    this.appModulePanel.leftsidenav.close();
  }

  toggleRightSidenav($event) {
    if ($event == this.navEvent) {
        // this.appModulePanel.rightsidenav.close();
        this.appModulePanel.rightsidenav.toggle();
        this.appModulePanel.showCommonMenu = $event;
    } else if ($event == 'open-right-sidenav') {
        this.appModulePanel.rightsidenav.open();
        this.appModulePanel.showCommonMenu = $event;
    } else {
      // this.appModulePanel.rightsidenav.toggle();
      this.appModulePanel.rightsidenav.open();
      this.appModulePanel.showCommonMenu = $event;
    }
    this.navEvent = $event
  }
  handleToolbarModuleNameChange($event) {
    this.appToolbarPanel.moduleName = $event;
  }
  refreshModule($event) {
    this.appModulePanel.refreshM($event);
  }
  mydate = new Date();


  refershNetwork() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        id: '',
        title: 'Network Error',
        message: 'Please try again',
        button_yes: 'OK',
        button_no: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

}
