import { Component, OnInit } from '@angular/core';
import { Input, Output } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ViewChildren } from '@angular/core/src/metadata/di';
import { MatGridListModule } from '@angular/material/grid-list';
import { ViewEncapsulation } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MessageService } from '../../shared/services/message.service';
import { PageStateService, ModuleServices } from '../../shared/services/page-state.service';
import { AuthService } from '../../account/services/auth.service';
import { AppConstant } from '../../shared';
import * as _ from 'lodash';
@Component({
  selector: 'app-module-panel',
  templateUrl: './module-panel.component.html',
  styleUrls: ['./module-panel.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModulePanelComponent implements OnInit {
  // @Input() user: User;
  // @ViewChild(sidenav): sidenav;
  @Output() updateToolbarModuleName = new EventEmitter<string>();
  @ViewChild('leftsidenav') leftsidenav: MatSidenav;
  @ViewChild('rightsidenav') rightsidenav: MatSidenav;

  tiles = [
    { text: 'Purchasing', long_name: 'Purchasing', icon: 'account-tie.png', link: 'vendor' },
    { text: 'Inventory', long_name: 'Account Receivables', icon: 'inventory.png', link: 'inventory' },
    { text: 'Sales', icon: 'local_offer', link: 'purchase-request' },
    { text: 'Order', long_name: 'Order Processing', icon: 'shopping_cart', link: 'purchase-order' },
    // { text: 'Store', long_name: 'Inventory Control', icon: 'store', link: 'inventory' },
    // { text: 'HRMS', icon: 'group', link: 'hrms' },
    // { text: 'Payable', long_name: 'Account Payables', icon: 'poll', link: 'payable' },
    // { text: 'Ledger', long_name: 'General Ledger', icon: 'web_asset', link: 'ledger' },
    // { text: 'Report', long_name: 'Financial Reporting', icon: 'trending_up', link: 'report' },
    // { text: 'Admin', icon: 'person_outline', link: 'admin' }
  ];

  imgUrl = `assets/module-icon`;
  showApp: string;
  showCommonMenu: string;
  events = [];
  readonly USER_ROLE = AppConstant.ROLE;
  gridlistcount = 3;
  moduleName = null;
  currentUser = null;

  constructor (
    private moduleService: ModuleServices,
    private messageService: MessageService,
    private authService: AuthService,
    private pageStateService: PageStateService) { }

  ngOnInit() {
    this.authService.authenticated.subscribe(res => {
      if (this.authService.hasValidToken()) {
      }
    });
    this.loadModuleName();
  }

  onActivate() {
    window.scroll(0, 0);
  }
  public refreshM($event) {
    const r = JSON.parse(localStorage.getItem('userGroup'));
    this.userRole(r);
  }

  changeToolbarModuleName() {
    this.saveAppName();
    this.handleSearchEvent('');
    this.loadModuleName();
  }


  userRole(role) {
    _.forEach(role, (k) => {
      if (
        k.name === this.USER_ROLE.VENDOR ||
        k.name === this.USER_ROLE.PURCHASER
      ) {
        // purchasing
        this.currentUser = this.tiles[0].text;
      } else if (
        k.name === this.USER_ROLE.ROLE_PRODUCT_COORDINATOR ||
        k.name === this.USER_ROLE.ROLE_PRODUCT_MANAGER ||
        k.name === this.USER_ROLE.ROLE_STOCK_OBSERVER
      ) {
        // inventory
        this.currentUser = this.tiles[1].text;
      }
    });
  }

  saveAppName() {
    this.moduleService.saveName(this.showApp);
  }

  loadModuleName() {
    const name = localStorage.getItem('module-name');
    this.updateToolbarModuleName.emit(name);
  }

  handleSearchEvent(ev) {
    this.rightsidenav.close();
  }

  tileClick() {
    this.pageStateService.init();
    this.messageService.sendMessage('search:loadstate', null);
  }
  activeModule(link): string {
    let cls = null;
    this.moduleName = localStorage.getItem('module-name');
    if (link === this.moduleName) {
      cls = 'c-col-active';
    } else {
      cls = 'c-col';
    }
    return cls;
  }
}
