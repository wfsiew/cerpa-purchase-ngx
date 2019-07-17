import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../account/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ProductPricingService } from './product-pricing.service';
import { Location } from '@angular/common';
import { ResponseWrapper, AppConstant } from '../../../shared';
import { Product, CurrentUser } from './product-pricing.model';
import { PurchaseTabs } from '../purchase.tabs';
import { ProductPricingHistoryComponent } from './product-pricing.history.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RaisePoDialogComponent } from './raise-po-dialog/raise-po-dialog.component';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  isvendor: boolean;
  product: Product[];
  tabs = PurchaseTabs.tabs;
  defaultImage: string = 'assets/images/default-m-icon/default-m-icon.png';

  promoNow: boolean = false;
  validDate: any;
  upcomingDate: any;
  promoPrice: any;
  constructor(
    private productService: ProductPricingService,
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.initRole();
  }

  setCurrentUser() {
    this.productService.queryCurrentUser().subscribe((res) => {
      const entity: CurrentUser = Object.assign(new CurrentUser(), res);
      if (entity.groups[0].name === AppConstant.ROLE.PURCHASER){
        this.getViewId();
      }
      else {
        this.location.back();
      }
    })
  }
  initRole() {
    if (!this.authService.getUser()) {
      this.authService.queryUserDetails().subscribe(
        user => {
          if (user.id) {
            this.isvendor = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
            if(user.groups[0].name === AppConstant.ROLE.PURCHASER){
              this.getViewId();
            }else{
              this.location.back();
            }
          }
        }
      )
    }
    else {
      this.isvendor = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
      if (this.isvendor) {
        this.location.back();
      }else{
        this.getViewId();
      }
    }
  }

  
  goViewVendor(id) {
    console.log('view vendor');
    this.router.navigate([`/vendor`, id]);
  }

  getViewId() {
    this.viewProducts(this.route.snapshot.params.id);
  }
  viewProducts(id: number) {
    if (id >= 0) {
      this.productService.queryViewProducts(id).subscribe(
        (res: ResponseWrapper) => this.onSuccess(res),
        (res: ResponseWrapper) => this.onError(res)
      )
    }else{
      this.location.back();
    }
  }
  openDialog() {
    var id = this.route.snapshot.params.id;
    if (/^\d+$/.test(id)) {
      const dialogRef = this.dialog.open(RaisePoDialogComponent, {
        width: '50%',
        height: '40%',
        autoFocus: false,
        data: { id: id }
      });
      dialogRef.afterClosed().subscribe(
        (res) => {
          console.log(res);
        }
      );
    } else {
      return this.back();
    }
  }

  viewProductHistory(){
    var id = this.route.snapshot.params.id;
    if (/^\d+$/.test(id)) {
      const dialogRef = this.dialog.open(ProductPricingHistoryComponent, {
        width: '80%',
        height: '80%',
        autoFocus: false,
        data: { id: id }
      });
      dialogRef.afterClosed().subscribe(
        (res) => {
          console.log(res);
        }
      );
    } else {
      return this.back();
    }
  }

  private onSuccess(res: ResponseWrapper) {
    this.product = res.data;
    for (let i = 0; i < res.data.promotions.length; i++) {
      if(res.data.promotions[i].current_promotion == true) {        
        this.promoNow = true;
        this.promoPrice = res.data.promotions[i].price;
        this.validDate = res.data.promotions[i].to_date;
      }
      else {
        this.upcomingDate = res.data.promotions[i].from_date;
      }  
    }
    console.log(res.data.pricings);    
  }

  private onError(error: ResponseWrapper) {
    console.log(error);
    // update error handling..
  }

  

  back() {
    this.location.back();
  // this.router.navigate(['product-pricing'])
  }
}
 