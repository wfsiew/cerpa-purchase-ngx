import { Component, OnInit } from '@angular/core';
import { InventoryService } from './inventory.service';
import {
  AppLocaleConstant,
  AppConstant,
  ResponseWrapper,
  Pager,
  Sort,
  Pagination,
  parsePagination,
  SortOrder,
  MessageService,
  OptionalSortingTerms,
} from '../../shared';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Inventory } from './inventory.tabs';
import { InventoryPageService } from '../../shared/services/inventory/inventory-state.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})

export class InventoryComponent implements OnInit {
  readonly appConstant = AppConstant;
  tabs = Inventory.tabs;
  term = '';
  page = 1;
  pagination: Pagination;
  pagesize = AppConstant.PAGE_SIZE;
  hasError = false;

  /** Check Boxes */
  belowParLevel = false;
  expiredStock = false;
  notForSale = false;
  currentPromotion = false;
  capacity = null;
  category = null;
  categoryList = [
    { id: 1, name: 'Item 1'},
    { id: 2, name: 'Item 2'},
    { id: 3, name: 'Item 3'}
  ];
  capacityList = [
    { id: 1, name: 'Item 1'},
    { id: 2, name: 'Item 2'},
    { id: 3, name: 'Item 3'}
  ];

  constructor (
    private inventoryService: InventoryService,
    private translateService: TranslateService,
    private router: Router,
    private pageState: InventoryPageService
  ) {
    this.translateService.setDefaultLang('en');
    this.pagination = new Pagination();
  }

  ngOnInit() {
    this.load();
  }
  // search(terms) {
  //   const term = terms.value;
  //   this.inventoryService.get_searchProductList(term).subscribe((res) => {
  //     console.log(res);
  //   });
  // }
  searchProducts(event) {
    // this.term = event.target.value;
    // const params = {capacity: this.capacity, category: this.category,
    //   notForSale: this.notForSale, currentPromotion: this.currentPromotion, expiredStock: this.expiredStock};
    // this.inventoryService.get_searchProductList(this.term, new Pager(this.page, AppConstant.PAGE_SIZE,
    //   [new Sort('product', 'asc')]), params).subscribe((res) => {
    //   console.log(res);
    // });
  }
  onSortCategory(eve) {
    this.category = eve;
  }
  onSortCapacity(eve) {
    this.capacity = eve;
  }

  load() {
    if (this.pageState.saveState) {
      this.loadState();
      console.log('in search mode');
    } else {
      console.log('in load mode');
    }
  }

  saveState() {
    this.pageState.page = this.page;
    this.pageState.term = this.term;
    this.pageState.productType = this.capacity;
    this.pageState.category = this.category;
    this.pageState.notForSale = this.notForSale;
    this.pageState.expiredStock = this.expiredStock;
    this.pageState.belowParLevel = this.belowParLevel;
    this.pageState.currentPromo = this.currentPromotion;
    this.pageState.saveState = true;
  }

  loadState() {
    console.log(this.pageState);
  }

  ViewCard(event, data) {}

  goto(ev) {
    // this.isSearch ? this.executeSearch(ev.pageIndex + 1) : this.loadList(ev.pageIndex + 1);
  }

  addNewProduct() {
    this.saveState();
    this.router.navigate(['/new-product']);
  }
  resetFilter() {
    this.pageState.initInventory();
    this.setInit();
    this.load();
  }

  setInit() {
    this.term = '';
    this.category = null;
    this.capacity = null;
    this.page = 1;
    this.notForSale = false;
    this.expiredStock = false;
    this.currentPromotion = false;
    this.belowParLevel = false;
  }
}
