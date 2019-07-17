import { Component, OnInit } from '@angular/core';
import { InventoryService } from './inventory.service';
import {
  AppConstant,
  Pager,
  Pagination,
  parsePagination,
  AppLocaleConstant
} from '../../shared';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Inventory } from './inventory.tabs';
import * as _ from 'lodash';
import { debounceTime } from 'rxjs/operators';
import { InventoryPageService } from '../../shared/services/inventory/inventory-state.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Observable } from 'rxjs/observable';
import { AuthService } from '../../account/services/auth.service';
import { ConfirmDialogComponent } from '../../shared/components';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css']
})
export class ProductListingComponent implements OnInit {
  readonly appConstant = AppConstant;
  tabs = Inventory.tabs;
  list = [];
  term = '';
  s = [];
  page = 1;
  pagination: Pagination;
  pagesize = AppConstant.PAGE_SIZE;
  hasError = false;
  isNotAbleToAddProduct = false;
  isStockObserver = false;
  isProductCoordinator = false;
  isCoordinator = false;
  ispManager = false;
  /** Check Boxes */
  belowParLevel = false;
  expiredStock = false;
  notForSale = false;
  currentPromotion = false;

  searchMode = false;

  productType: any = '';
  category: any = '';
  categoryList = [];
  capacityList = [
    { id: 0, name: 'Rebranded' },
    // { id: 1, name: 'Divided' },
    // { id: 2, name: 'Repackaged' },
    // { id: 3, name: 'Service' }
  ];

  sortList = [];
  constructor (
    private inventoryService: InventoryService,
    private translateService: TranslateService,
    private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private pageState: InventoryPageService,
    public dialog: MatDialog
  ) {
    this.translateService.setDefaultLang('en');
    this.pagination = new Pagination();
  }

  ngOnInit() {
    this.loadState();
    this.loadProductCategory();
    const userRoles: any = JSON.parse(localStorage.getItem('userGroup'));
    this.isStockObserver = _.some(userRoles, (value, i, ls) => {
        return this.appConstant.ROLE.ROLE_STOCK_OBSERVER === value.name;
    });
    this.isNotAbleToAddProduct = this.authService.hasRole(
      [this.appConstant.ROLE.ROLE_PRODUCT_MANAGER]);
    this.isCoordinator = this.authService.hasRole(
      [this.appConstant.ROLE.ROLE_PRODUCT_COORDINATOR]);

    this.ispManager = this.authService.hasRole(
      [this.appConstant.ROLE.ROLE_PRODUCT_MANAGER]);
  }
  loadProductCategory() {
    this.inventoryService.get_autocompleteProductCategory('').subscribe((res: any) => {
      this.categoryList = res;
    });
  }


  searchProducts(event) {
    this.pageState.saveState = false;
    this.page = 1;
    this.term = event.target.value;
    this.searchMode = true;
    this.loadState();
  }
  search() {
    const params = {
      product_type: this.productType,
      product_category: this.category,
      reached_par_level: this.belowParLevel,
      notForSale: this.notForSale,
      currentPromotion: this.currentPromotion,
      expiredStock: this.expiredStock
    };
    this.inventoryService.get_searchProductList(this.term, new Pager(this.page, AppConstant.PAGE_SIZE,
      []), params, this.sortList).pipe(debounceTime(1200)).subscribe((res: any) => {
        this.onSuccess(res);
      });
  }
  onCategory(eve) {
    this.category = eve;
    this.searchMode = true;
    this.loadState();
  }
  onProductType(eve) {
    this.productType = eve;
    this.page = 1;
    this.searchMode = true;
    this.loadState();
  }

  belowPar(e) {
    this.belowParLevel = e.checked;
    this.searchMode = true;
    const i = _.indexOf(this.sortList, 'below_par_level');
    if (i < 0) {
      this.sortList.push('below_par_level');
    } else {
      const lx = _.remove(this.sortList, (k) => {
        return k === 'below_par_level';
      });
    }
    this.searchMode = true;
    this.page = 1;
    // this.s.push({'below_par_level': e.checked});
    // const t = _.findIndex(this.s, function(o) {
    //   return o.below_par_level === 'below_par_level';
    // });
    // console.log(t);

    this.loadState();
  }
  itemNotForSale(e) {
    this.notForSale = e.checked;
    const i = _.indexOf(this.sortList, 'not_for_sale');
    if (i < 0) {
      this.sortList.push('not_for_sale');
    } else {
      const lx = _.remove(this.sortList, (k) => {
        return k === 'not_for_sale';
      });
    }
    this.searchMode = true;
    this.page = 1;
    this.loadState();
  }
  itemCurrentPromotion(e) {
    this.currentPromotion = e.checked;
    const i = _.indexOf(this.sortList, 'current_promotion');
    if (i < 0) {
      this.sortList.push('current_promotion');
    } else {
      const lx = _.remove(this.sortList, (k) => {
        return k === 'current_promotion';
      });
    }
    this.searchMode = true;
    this.page = 1;
    this.loadState();
  }
  itemExpiredStock(e) {
    this.expiredStock = e.checked;
    const i = _.indexOf(this.sortList, 'expired_stock');
    if (i < 0) {
      this.sortList.push('expired_stock');
    } else {
      const lx = _.remove(this.sortList, (k) => {
        return k === 'expired_stock';
      });
    }
    this.searchMode = true;
    this.page = 1;
    this.loadState();
  }

  saveState() {
    console.log(this.belowParLevel);
    this.searchMode = false;
    this.pageState.sortList = this.sortList;
    this.pageState.page = this.page;
    this.pageState.term = this.term;
    this.pageState.productType = this.productType;
    this.pageState.category = this.category;
    this.pageState.notForSale = this.notForSale;
    this.pageState.expiredStock = this.expiredStock;
    this.pageState.belowParLevel = this.belowParLevel;
    this.pageState.currentPromo = this.currentPromotion;
    this.pageState.saveState = true;
  }

  loadState() {
    this.spinnerService.show();
    if (this.pageState.saveState) {
      this.belowParLevel = this.pageState.belowParLevel;
      this.notForSale = this.pageState.notForSale;
      this.expiredStock = this.pageState.expiredStock;
      this.currentPromotion = this.pageState.currentPromo;
      this.page = this.pageState.page;
      this.term = this.pageState.term;
      this.sortList = this.pageState.sortList;
      this.category = this.pageState.category;
      this.productType = this.pageState.productType;

      this.pageState.saveState = false;

      this.search();
    } else if (this.searchMode) {
      this.search();
    } else {
      this.load();
    }
  }

  ViewCard(event, data) {
    this.saveState();
  }

  goto(ev) {
    this.spinnerService.show();
    this.page = ev.pageIndex + 1;
    if (this.searchMode || this.pageState.saveState) {
      this.load();
    } else {
      this.loadState();
    }
    // this.isSearch ? this.executeSearch(ev.pageIndex + 1) : this.loadList(ev.pageIndex + 1);
  }

  addNewProduct() {
    this.saveState();
    this.router.navigate(['/new-product']);
  }
  resetFilter() {
    this.pageState.initInventory();
    this.setInit();
    this.loadState();
  }

  load() {
    this.searchMode = false;
    this.inventoryService.get_ProductList(new Pager(this.page, AppConstant.PAGE_SIZE, [])).subscribe((res: any) => {
      this.onSuccess(res);
    });
  }

  setInit() {
    this.searchMode = false;
    this.term = '';
    this.category = '';
    this.productType = '';
    this.page = 1;
    this.notForSale = false;
    this.expiredStock = false;
    this.currentPromotion = false;
    this.belowParLevel = false;
  }

  blankPicture(img) {
    let ur = null;
    if (img.length > 0) {
      ur = img[0].picture;
    } else {
      ur = this.appConstant.DEFAULT_ICONS.USER_ICON;
    }
    return ur;
  }

  edit(id) {
    this.saveState();
    this.router.navigate(['edit-product', id]);
  }
  addProductBatch(data) {
    this.saveState();
    this.router.navigate(['add-batch', data.id, data.name]);
  }
  viewProductBatchList(data) {
    this.saveState();
    this.router.navigate(['batch-list', data.id, data.name]);
  }
  viewProduct(data) {
    this.router.navigate(['view-product', data.id]);
  }
  deleteProduct(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '10%',
      minHeight: '10%',
      data: {
        id: data.id,
        message: 'inventory.product.delete.message',
        name: '*',
        title: 'inventory.product.delete.title',
        button_yes: AppLocaleConstant.APP_BUTTON_YES,
        button_no: AppLocaleConstant.APP_BUTTON_NO
      },
      closeOnNavigation: false
    });

    dialogRef.afterClosed().subscribe(result => {
      this.saveState();
      this.spinnerService.show();
      if (result) {
        this.saveState();

        this.inventoryService.delete_product(data.id).subscribe((res) => {
          this.spinnerService.hide();
          console.log({ message: 'Successfully deleted' }, res);
        }, (err) => {
          this.onError(err);
        });
      } else {
        this.spinnerService.hide();
      }
    });
  }

  onSuccess(res) {
    this.spinnerService.hide();
    this.list = res.body;
    this.pagination = parsePagination(res.headers);
  }

  onError(err) {
    this.spinnerService.hide();
    console.log(err);
  }
}
