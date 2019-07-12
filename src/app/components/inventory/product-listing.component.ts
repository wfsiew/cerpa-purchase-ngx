import { Component, OnInit } from '@angular/core';
import { InventoryService } from './inventory.service';
import {
  AppConstant,
  Pager,
  Pagination,
  parsePagination,
} from '../../shared';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Inventory } from './inventory.tabs';
import * as _ from 'lodash';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { InventoryPageService } from '../../shared/services/inventory/inventory-state.service';
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
  page = 1;
  pagination: Pagination;
  pagesize = AppConstant.PAGE_SIZE;
  hasError = false;
  isNotAbleToAddProduct = false;
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
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  sortList = [];
  constructor (
    private inventoryService: InventoryService,
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private pageState: InventoryPageService
  ) {
    this.translateService.setDefaultLang('en');
    this.pagination = new Pagination();
  }

  ngOnInit() {
    this.route.data.subscribe((res: any) => {
      const ROLES = res.roles;
      const r = ROLES.map(function (e) { return e.ROLE_PRODUCT_MANAGER; }).indexOf(this.appConstant.ROLE.ROLE_PRODUCT_MANAGER);
      if (r !== - 1) {
        this.isNotAbleToAddProduct = true;
      } else {
        this.isNotAbleToAddProduct = false;
      }
    });
    this.loadState();
    this.loadProductCategory();
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
    console.log(this.sortList);
    this.searchMode = true;
    this.loadState();
  }

  onSortFilter(key, value) {
    const i = _.indexOf(this.sortList, key);
    if (i < 0) {
      this.sortList.push(key);
    } else {
      const lx = _.remove(this.sortList, (k) => {
        return k === key;
      });
    }
  }

  saveState() {
    this.searchMode = false;
    this.pageState.page = this.page;
    this.pageState.term = this.term;
    this.pageState.capacity = this.productType;
    this.pageState.category = this.category;
    this.pageState.notForSale = this.notForSale;
    this.pageState.expiredStock = this.expiredStock;
    this.pageState.belowParLevel = this.belowParLevel;
    this.pageState.currentPromo = this.currentPromotion;
    this.pageState.saveState = true;
  }

  loadState() {
    if (this.pageState.saveState) {
      this.page = this.pageState.page;
      this.term = this.pageState.term;
      this.category = this.pageState.category;
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
  deleteProduct(id) {
    this.saveState();
    console.log({ message: 'Successfully deleted' });
  }

  onSuccess(res) {
    this.list = res.body;
    this.pagination = parsePagination(res.headers);
  }

  onError(err) {
    console.log(err);
  }
}
