import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../inventory.service';
import { AppConstant } from '../../../shared';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  readonly appConstant = AppConstant;
  product: any;
  pictureUrl = null;
  productTypeList = [
    { id: 0, name: 'Rebranded' },
    { id: 1, name: 'Divided' },
    { id: 2, name: 'Repackaged' },
    { id: 3, name: 'Service' }
  ];

  constructor (
    private spinnerService: Ng4LoadingSpinnerService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private inventoryService: InventoryService
  ) {
    this.translateService.setDefaultLang('en');
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
      this.reloadProduct(id);
      this.getImage(id);
  }

  reloadProduct(id) {
    this.spinnerService.show();
    this.inventoryService.get_product(id).subscribe((res) => {
      this.product = res;
      console.log(res);
      this.spinnerService.hide();
    });
  }

  getImage(id) {
    this.inventoryService.get_productPicture(id).subscribe((res: any) => {
      if (res.length > 0) {
        this.pictureUrl = res[0].picture;
      } else {
        this.pictureUrl = this.appConstant.DEFAULT_ICONS.USER_ICON;
      }
    });
  }

  blankImage(img) {
    let im = null;
    if (_.isEmpty(img)) {
      im = this.appConstant.DEFAULT_ICONS.USER_ICON;
    } else {
      im = img;
    }
    return im;
  }

  isAutoAddStock(autoAdd) {
    let a = null;
    if (autoAdd) {
      a = 'text-success';
    } else {
      a = 'text-danger';
    }
    return a;
  }
}
