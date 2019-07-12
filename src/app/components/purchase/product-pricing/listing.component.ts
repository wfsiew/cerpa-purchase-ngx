import { Component, OnInit, Output, EventEmitter, OnDestroy, Inject, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductPricingService } from './product-pricing.service';
import { ProductPricingData, Category } from './product-pricing.model';
import { MatDialog, DialogPosition, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SearchService } from '../../common/search';
import { FormControl } from '@angular/forms'
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
  PageStateService,
} from '../../../shared';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../account/services/auth.service';
import { ConfirmDialogComponent } from '../../../shared/components';
import { PurchaseTabs } from '../purchase.tabs';
import { ProductPricingConstant } from './product-pricing.constant';
import { AccountLocalConstant } from '../../account/account-locale.constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
@Output()
export class ListingComponent implements OnInit, OnDestroy {
  productPricingData: ProductPricingData[];
  dialogPosition: DialogPosition
  tabs = PurchaseTabs.tabs;
  // checkedCategory = [0,1,2,3]
  page = 1;
  totalPage  = 20;
  pageLenght = 0;
  sortOrder = SortOrder.ASC;
  pagesize = AppConstant.PAGE_SIZE;
  pagination: Pagination;
  default_sort = 'cheapest_first'
  //AppConstant.DEFAULT_SORT_FIELD; // double cheack .....

  user_role: boolean = false;
  isSearchMood: boolean = false;
  isvendor: boolean;

  searchData = null;

  // to store the list of responses
  categoryList: any;
  creditTermList: any;
  sortList: any

  // to store the params
  categoryParams = [];
  sortByParams = '';
  termParams = '';
  seletedSortOption: any;
  selectedTerm: any;
  checkedCategory: boolean = false;

  hasError: boolean = false;
  errorMessage: string;
  isSearch: boolean = false;

  keyword = '';
  statusStore = [];
  paymentTermSelected = [];
  categoriesSelected = [];
  filterSelected = [];
  listLoaded: Boolean = false;

  filterSelectionList = [
    { key: 0, value: 'Current Promotion Item' },
    { key: 1, value: 'Tier Price' }
  ];
  ss = [];

  termSelectionList = [
    { key: 0, value: 'Cash on Delivery' },
    { key: 7, value: '7 Days' },
    { key: 15, value: '15 Days' },
    { key: 30, value: '30 Days' },
    { key: 60, value: '60 Days' },
    { key: 90, value: '90 Days' }
  ]

  categoryForm = new FormControl('');
  @Output() __loading: EventEmitter<boolean> = new EventEmitter();
  sortField = ProductPricingConstant.DEFAULT_SORT_FIELD;
  paymentTermList: any = [];
  paymentTermData: any = '';
  isPromoItems = '';
  hasTierPrice = '';
  filterName: string;
  noRecordMsg: string;

  constructor(
    public router: Router,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthService,
    private productService: ProductPricingService,
    private searchService: SearchService,
    private messageService: MessageService,
    private pageState: PageStateService
  ) {
    this.pagination = new Pagination();
  }

  ngOnInit() {
    this.translateService.setDefaultLang('en')
    this.initRole();
    this.productService.changeSearch('');
    let i = 0;
    if (this.searchData != null) {
      i = this.searchData.selectedOption + 1;
    }
    //this.search();
    this.spinnerService.show();
    this.autoCategoryList();
    // this.CreditTermList();
    this.sortingList();
    this.productPricingData = []
    this.loadState();
  }

  saveState() {
    this.pageState.pp_page = this.page;
    this.pageState.pp_keyword = this.keyword;
    this.pageState.pp_promo = this.isPromoItems;
    this.pageState.pp_tierPrice = this.hasTierPrice;
    this.pageState.pp_paymentTermData = this.paymentTermData;
    this.pageState.pp_categoryParams = this.categoryParams;
    this.pageState.pp_paymentTermSelectedPP = this.paymentTermSelected;
    this.pageState.pp_filterSelected = this.filterSelected;
    this.pageState.pp_save = this.isSearch;
    this.pageState.pp_categoriesSelected = this.categoriesSelected;
  }

  loadState() {
    this.spinnerService.show();
    this.page = this.pageState.pp_page;
    this.keyword = this.pageState.pp_keyword;
    this.isPromoItems = this.pageState.pp_promo;
    this.hasTierPrice = this.pageState.pp_tierPrice;
    this.paymentTermData = this.pageState.pp_paymentTermData;
    this.categoryParams = this.pageState.pp_categoryParams;
    this.paymentTermSelected = this.pageState.pp_paymentTermSelectedPP;
    this.categoriesSelected = this.pageState.pp_categoriesSelected;
    this.filterSelected = this.pageState.pp_filterSelected;
    this.isSearch = this.pageState.pp_save;
    this.pageState.initPP();
    this.executeSearch(this.page);
  }


  resetFilter() {
    this.pageState.initPP();
    this.loadState();
    this.filterName = '';
    this.autoCategoryList();
  }

  /**
   * check for any search message 
   */
  searching() {
    return this.messageService.getMessage().subscribe(
      (res: any) => {
        if (res.data && res.data.searchKeyword != '') {
          this.isSearchMood = true
        } else {
          this.isSearchMood = false;
        }
      })
  }

  /**
   * @param page 
   * @see if the page is in search mood then @see search will load the page with reached params
   */
  search(page: number = 1) {
    this.spinnerService.show();
    this.page = page;
    this.messageService.getMessage().subscribe((res: any) => {
      if (res.data != null) {
        // console.log('search');

        this.productService.querySearch(res.data.searchKeyword,
          new Pager(page, AppConstant.PAGE_SIZE,
            [new Sort(AppConstant,
              this.sortOrder)])).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res),
                (res: ResponseWrapper) => this.onError(res)
              )
      } else {
        return
      }
    })
  }

  /**
   * @see cheacking is the page still in search mood 
   */
  isSearching() {
    this.spinnerService.show();
    if (this.isSearchMood) {
      return this.searching();
    } else {
      return this.loadList();
    }
  }

  searchProducts(event, page: number = 1) {
    this.spinnerService.show();
    this.page = page;
    this.keyword = event.target.value;
    this.executeSearch();
  }

  setSearchFilter(value, index) {
    this.ss.push(value);
    this.spinnerService.show();
    var _value = '';
    if (value) {
      _value = 'True';
    }

    switch (index) {
      case 0: {
        this.isPromoItems = _value;
        this.filterSelected[0] = _value;
        console.log(this.isPromoItems);
        console.log(this.filterSelected[0]);


        break;
      }
      case 1: {
        this.hasTierPrice = _value;
        this.filterSelected[1] = _value;
        break;
      }
    }
    this.executeSearch(1);
    console.log(this.hasTierPrice);

  }

  setTermSort(value, index) {
    this.filterSelected[index] = !this.filterSelected[index];
    value.selected = this.filterSelected;
 
    if (value.selected[0]) {
      this.isPromoItems = 'true';
    }
    else {
      this.isPromoItems = '';
    }
    if (value.selected[1]) {
      this.hasTierPrice = 'true';
    }
    else {
      this.hasTierPrice = '';
    }
    this.executeSearch(1);
  }

  getFilterSelected(i) {
    return this.filterSelected[i];
  }


  
  setTermFilter(index) {
    this.paymentTermSelected[index] = !this.paymentTermSelected[index];
    if (this.paymentTermSelected[index]) {
      this.paymentTermList.splice(index, 0, this.termSelectionList[index].key);
    } else {
      var i = this.paymentTermList.indexOf(this.termSelectionList[index].key);
      this.paymentTermList.splice(i, 1);
    }

    if (this.paymentTermList.length > 0) {
      this.paymentTermData = '';
      this.paymentTermList.forEach(element => {
        if (this.paymentTermData === '') {
          this.paymentTermData = element;
        } else {
          this.paymentTermData = this.paymentTermData + ":" + element;
        }
      });
    } else {
      this.paymentTermData = '';
    }
    this.executeSearch(1);
  }


  getTermSelected(index) {
    return this.paymentTermSelected[index];
  }


  getCategoriesSelected(index) {
    return this.categoriesSelected[index];
  }

  executeSearch(page: number = 1) {
    var filter;
    this.isSearch = (this.categoryParams.length > 0 || this.isPromoItems !== '' || this.hasTierPrice !== '' || this.termParams !== '' || this.paymentTermData !== '' || this.keyword !== '')
    filter = {
      category: this.categoryParams,
      isPromoItems: this.isPromoItems,
      hasTierPrice: this.hasTierPrice,
      term: this.termParams,
      paymentTerms: this.paymentTermData
    };
    this.page = page;
    this.productService.search(this.keyword, filter, this.sortByParams,
      new Pager(this.page, AppConstant.PAGE_SIZE,
        [this.sortByParams])).subscribe(
          (res: ResponseWrapper) => this.onSuccess(res),
          (res: ResponseWrapper) => this.onError(res)
        )
  }


  /**
   * @param v 
   * @see get the list of category
   */
  autoCategoryList() {
    this.productService.queryGetAutoCategoryList(null).subscribe((res: any = []) => {
      this.categoryList = res;
      this.spinnerService.hide();
    })
  }


  searchCategory(event) {
    var term = event.target.value;
    if (term.length > 0) {
      this.productService.queryGetAutoCategoryList(term).subscribe((res: any = []) => {
        this.categoryList = res;
        this.spinnerService.hide();

        this.pageState.initPP();
        this.loadState();
      })
    } else {
      this.autoCategoryList();
    }
  }

  selectCategory(event) {
    var term = event.target.innerHTML;
    if (term.length > 0) {
      this.productService.queryGetAutoCategoryList(term).subscribe((res: any = []) => {
        this.categoryList = res;
        this.spinnerService.hide();

        this.pageState.initPP();
        this.loadState();
      })
    } else {
      this.autoCategoryList();
    }
  }

  /**
   * @param v 
   * @see get the list of sorts
   */
  sortingList() {
    this.spinnerService.show();
    this.productService.queryGetSortingList().subscribe((res) => {
      this.sortList = res;
      this.spinnerService.hide();
      // this.seletedSortOption = this.sortingList[0]
    })
  }

  /**
   * 
   * @param v 
   * set Sort Options
   */
  setSortOption(v) {
    this.sortByParams = v;
    // console.log('sortoptions');

    this.executeSearch(this.page);
    // this.productService.queryListing(-1,
    //   new OptionalSortingTerms(this.termParams, this.categoryParams),
    //   new Pager(this.pager, AppConstant.PAGE_SIZE,
    //     [this.sortByParams])).subscribe(
    //       (res: ResponseWrapper) => this.onSuccess(res),
    //       (res: ResponseWrapper) => this.onError(res)
    //     )
  }

  /**
   * @param v 
   * @see get the list of credit term
   */
  CreditTermList() {
    this.spinnerService.show();
    this.productService.queryGetTermList().subscribe((res) => {
      this.creditTermList = res;
      this.spinnerService.hide();
      this.selectedTerm = this.creditTermList[0];
    })
  }

  // /**
  //  * @param v 
  //  * set term 
  //  */
  // setTerm(v) {
  //   this.spinnerService.show();
  //   this.termParams = v;
  //   this.productService.queryListing(-1,
  //     new OptionalSortingTerms(this.termParams, this.categoryParams),
  //     new Pager(this.pager, AppConstant.PAGE_SIZE,
  //       [this.sortByParams])).subscribe(
  //           (res: ResponseWrapper) => this.onSuccess(res),
  //           (res: ResponseWrapper) => this.onError(res)
  //         )
  // }

  setCategories(index) {
    this.categoriesSelected[index] = !this.categoriesSelected[index];
    this.spinnerService.show();
    if (this.categoryParams.length > 0) {
      var o = this.categoryParams.indexOf(this.categoryList[index]);
      if (o !== -1) { this.categoryParams.splice(o, 1) }
      else { this.categoryParams.push(this.categoryList[index]) }
    } else {
      this.categoryParams.push(this.categoryList[index])
    }

    // if (this.keyword != '') {
    this.executeSearch();
    // } else {
    //   console.log('setCategories');

    //   this.productService.queryListing(-1,
    //     new OptionalSortingTerms(this.termParams, this.categoryParams),
    //     new Pager(this.pager, AppConstant.PAGE_SIZE,
    //       [this.sortByParams])).subscribe(
    //         (res: ResponseWrapper) => this.onSuccess(res),
    //         (res: ResponseWrapper) => this.onError(res)
    //       )
    // }
  }

  /**
   * @see checking the logged in user role
   */

  initRole() {
    this.spinnerService.show();
    if (!this.authService.getUser()) {
      this.authService.queryUserDetails().subscribe(
        user => {
          if (user.id) {
            this.isvendor = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
            if (this.isvendor) {
              this.tabs = PurchaseTabs.tabs_vendor;
              this.user_role = true;
              this.spinnerService.hide();
              //this.isSearching();
            } else if (user.groups[0].name === AppConstant.ROLE.PURCHASER) {
              this.tabs = PurchaseTabs.tabs;
              //this.isSearching();
            } else {
              // console.log('error ...');
            }
          }
        }
      )
    }
    else {
      this.isvendor = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
      if (this.isvendor) {
        this.tabs = PurchaseTabs.tabs_vendor;
        this.spinnerService.hide();
        this.user_role = true;
        //this.isSearching();
      } else {
        //this.isSearching();
        // console.log('purchaser');
        this.tabs = PurchaseTabs.tabs;
      }
    }
  }

  /**
   * @param page 
   * @see defualt search list one the page is loeaded @see loadList function will the withh all default params
   */
  loadList(page: number = 1) {
    this.spinnerService.show();
    this.page = page;
    // console.log('loadList');

    this.productService.queryListing(-1,
      new OptionalSortingTerms(this.termParams, this.categoryParams),
      new Pager(this.page, AppConstant.PAGE_SIZE,
        [this.sortByParams])).subscribe(
          (res: ResponseWrapper) => this.onSuccess(res),
          (res: ResponseWrapper) => this.onError(res)
        )
  }

  /**
   * @param $event 
   * @see click_able the card and arrow manage of the card to prevent from multi clicks
   */
  manageItems($event) {
    $event.stopPropagation();
  }

  /**
   * @param $event 
   * @param product 
   * by clicking on the card or drop dwon option (View) it will be rediret to the user profile
   */
  viewItem($event, product) {
    const id = product.value.id;
    this.saveState();
    this.router.navigate([`view/${id}`]);
  }

  /**
   * @param $event 
   * @param product 
   * after click on the drop dwon there will two different arrow option 1: edit, 2: view it will be best on permations
   * @see view for purchase staff 
   * @see edit vorndor
   */
  ViewCard($event, product) {
    if (this.user_role) {
      this.editItem($event, product)
    } else {
      this.viewItem($event, product)
    }
  }

  /**
   * @param $event 
   * @param product 
   * if the logged user is @see Vndor can edit from here
   */
  editItem($event, product) {
    const id = product.value.id;
    this.saveState();
    this.router.navigate([`edit/${id}`]);
  }

  /**
   * navigating user to add new product pricing page
   */
  AddNew() {
    this.saveState();
    this.router.navigate([`add-product`])
  }

  /**
   * @param $event 
   * @param product 
   * if user want to delete any of the product, it will delete by @see deleteItem function 
   */

  deleteItem($event, product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '10%',
      minHeight: '10%',
      data: {
        id: product,
        message: ProductPricingConstant.DELETE_MESSAGE,
        name: '*',
        title: ProductPricingConstant.DELETE_TITLE,
        button_yes: AppLocaleConstant.APP_BUTTON_YES,
        button_no: AppLocaleConstant.APP_BUTTON_NO
      },
      closeOnNavigation: false
    });

    dialogRef.afterClosed().subscribe(result => {
      this.saveState();
      this.spinnerService.show();
      if (result) {
        var id = product.value.id;
        this.productService.queryDeleteProduct(id).subscribe(
          (res) => {
            var totalRecord = this.pagination.totalRecords;
            var newPage = totalRecord % this.pagesize;
            if (newPage! < 2 && totalRecord > 1) {
              console.log('delete');
              this.pageState.pp_page = this.page - 1;
            }
            this.loadState();
          }
        )
      }
      else
        this.spinnerService.hide();
    });
  }

  /**
   * @param res after any success loading the @see loadList function the result will exacut from here
   */
  private onSuccess(res: ResponseWrapper) {
    this.hasError = false;
    this.spinnerService.hide();
    this.pagination = parsePagination(res.headers);
    this.productPricingData = res.data;
    if (this.productPricingData.length == 0) {
      this.noRecordMsg = 'No record found!';
    }
  }

  /**
   * @param error  
   * any error either fron-end response issue and back response issue the error will be throwen from here
   */
  private onError(error: ResponseWrapper) {
    this.hasError = true;
    this.spinnerService.hide();
    this.translateResponseMessage(error.data);
  }

  translateResponseMessage(err): void {
    this.translateService.get([
      AccountLocalConstant.GEN_0002,
    ]).subscribe(
      (error_message) => {
        if (err.error.error === 'GEN_0006') {
          return this.router.navigate(['/login']);
        }
        else {
          return this.router.navigate(['/login'])
        }
      }
    )
  }
  /**
   * @param message 
   * @see display the response message for user
   */
  showResponseMessage(message: string): string {
    this.hasError = true;
    return this.errorMessage = message;
  }


  /**
   * after the search hase been excuted it will unsubscribe from here
   */
  ngOnDestroy() {
    this.searching().unsubscribe();
  }

  goto(ev) {
    this.isSearch ? this.executeSearch(ev.pageIndex + 1) : this.loadList(ev.pageIndex + 1);
  }
}
