import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountLocalConstant } from '../../../account/account-locale.constant';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseOrderService } from '../purchase-order.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthService } from '../../../../account/services/auth.service';
import { AppConstant, ResponseWrapper } from '../../../../shared';
import { PurchaseTabs } from '../../purchase.tabs';
import { VendorDoProduct } from '../../product-pricing';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-delivery-status',
  templateUrl: './delivery-status.component.html',
  styleUrls: ['./delivery-status.component.css']
})
export class DeliveryStatusComponent implements OnInit {
  message: string;
  hasError:boolean = false;
  poProducts: VendorDoProduct[];
  doProducts: VendorDoProduct[];
  itemsHistory: any = [];
  dataSource = new MatTableDataSource();
  overallPercent: number = 45;
  isVendor: boolean = false;
  tabs = PurchaseTabs.tabs;
  po_id: any;
  do_id: any;
  chartInfo: any;
  qty: any = [];
  //products: VendorDoProduct[];
  displayedColumns: string[] = ['date', 'accepted_quantity'];

  constructor(private authService: AuthService,
    private spinnerService: Ng4LoadingSpinnerService,
    private translateService: TranslateService,
    private pService: PurchaseOrderService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.po_id = this.route.snapshot.params.id;

    this.getChartInfo(this.po_id);
    this.getCurrentDoInfo(this.po_id);
    this.getItemHistory(this.po_id);
  }

  initRole() {
    this.spinnerService.show();
    if (!this.authService.getUser()) {
      this.authService.queryUserDetails().subscribe(
        user => {
          if (user.id) {
            this.spinnerService.hide();
            var haseGroup = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
            if (user.groups[0].name === AppConstant.ROLE.VENDOR) {
              this.isVendor = true;
              this.tabs = PurchaseTabs.tabs_vendor;
            } else if (user.groups[0].name === AppConstant.ROLE.PURCHASER) {
              this.isVendor = false;
              this.tabs = PurchaseTabs.tabs;
            } else {
              this.location.back()
            }
          }
        }
      )
    }
    else {
      if (this.authService.hasGroup(AppConstant.ROLE.VENDOR)) {
        this.tabs = PurchaseTabs.tabs_vendor;
        this.isVendor = true;
        this.spinnerService.hide();
      } else {
        this.isVendor = false;
        this.tabs = PurchaseTabs.tabs;
        this.spinnerService.hide();
      }
    }
  }

  back() {
    this.location.back();
  }

  // translateResponseMessage(err): void {
  //   this.translateService.get([
  //     AccountLocalConstant.GEN_0007,
  //   ]).subscribe(
  //     (error_message) => {
  //       if (err.error.error === 'GEN_0007') {
  //         return this.showResponseMessage(error_message[AccountLocalConstant.GEN_0007])
  //       } else {
  //         return this.showResponseMessage("Opps something went wrong")
  //       }
  //     }
  //   )
  // }

  // showResponseMessage(message: string): string {
  //   return this.message = message
  // }

  download() {}

  onChartSuccess(res) {
    this.overallPercent = res.overall.percent;
    this.poProducts = res.po_products;
  }

  onDoSuccess(res) {
    this.do_id = res.id;
    this.doProducts = res.do_products;
    if (this.doProducts != null) {
      this.doProducts.forEach(function (e, i) {
        e.accepted_quantity = e.quantity;
      });
    }
  }

  onItemHistorySuccess(res) {
    this.itemsHistory = res;
    this.dataSource = res
  }

  onSuccess(res) {
    this.getChartInfo(this.po_id);
    this.getCurrentDoInfo(this.po_id);
    this.getItemHistory(this.po_id);
    this.spinnerService.hide();
  }

  private onError(error: ResponseWrapper) {
    this.hasError = true;
    this.spinnerService.hide();
    // throw error
  }

  getChartInfo(id) {
    this.pService.queryChartInfo(id).subscribe(
      (res: ResponseWrapper) => this.onChartSuccess(res),
      (res: ResponseWrapper) => this.onError(res)
    )
  }

  getCurrentDoInfo(id) {
    this.pService.queryDoItems(id).subscribe(
      (res: ResponseWrapper) => this.onDoSuccess(res),
      (res: ResponseWrapper) => this.onError(res)
    )
  }

  getItemHistory(id) {
    this.pService.queryItemsHistory(id).subscribe(
      (res: ResponseWrapper) => this.onItemHistorySuccess(res),
      (res: ResponseWrapper) => this.onError(res)
    )
  }

  getDataSource(ls): any {
    var ds = new MatTableDataSource();
    ds = ls.delivery_history;
    return ds;
  }

  lessQty(idx) {
    if (this.doProducts[idx].accepted_quantity > 0)
      this.doProducts[idx].accepted_quantity -= 1;
  }

  addQty(idx) {
    if (this.doProducts[idx].accepted_quantity < this.doProducts[idx].quantity)
      this.doProducts[idx].accepted_quantity += 1;
  }

  updateVal(event, idx) {
    var val = parseInt(event.target.value);
    if (val) {
      if (val < this.doProducts[idx].quantity)
        this.doProducts[idx].accepted_quantity = val;
      else {
        this.doProducts[idx].accepted_quantity = this.doProducts[idx].quantity;
        event.target.value = this.doProducts[idx].quantity;
      }
    } else {
      this.doProducts[idx].accepted_quantity = 0;
    }
  }

  updateAccepted() {
    this.spinnerService.show();
    var data = {
      "id": this.do_id,
      "do_products": this.doProducts
    }
    // console.log(data);
    this.pService.updateDoItems(this.po_id, data).subscribe(
      (res: ResponseWrapper) => this.onSuccess(res),
      (res: ResponseWrapper) => this.onError(res));
  }
}
