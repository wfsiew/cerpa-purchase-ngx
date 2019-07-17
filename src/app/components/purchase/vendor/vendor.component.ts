import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../../account/services/auth.service';
import { VendorService } from './vendor.service';
import { SearchService } from '../../common/search/search.service';
import {
  Pager, Sort, ResponseWrapper, Pagination, parsePagination, SortOrder,
  AppConstant, AppLocaleConstant, MessageService, PageStateService
} from '../../../shared';
import { Vendor, VendorStatus } from './vendor.model';
import { VendorConstant } from './vendor.constant';
import { VendorLocaleConstant, VendorErrorLocalConstant } from './vendor-locale.constant';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/components';
import { PurchaseTabs } from '../purchase.tabs';
import { VendorInviteDialogComponent } from './vendor-invite-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CardComponent } from '../../../shared/components/card';
@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit, OnDestroy {
  @Output() publishEvent = new EventEmitter<string>();
  @ViewChild(CardComponent) child;

  defaultImage: string = 'assets/images/default-m-icon/default-m-icon.png';
  vendor_content: string = 'vendor-content';

  paymentTermSelectionList = [
    {key: 0, value: "Cash on Delivery" },
    {key: 7, value: "7 Days"},
    {key: 15,value: "15 Days"},
    {key: 30,value: "30 Days"},
    {key: 60,value: "60 Days"},
    {key: 90,value: "90 Days"}
  ]
  statusSelectionList = [
    {key: 1, value: "Active"},
    {key: 2, value: "Blacklisted"},
    {key: 3, value: "Invited"},
  ]
  hasError: boolean = false;
  vendors = [];
  pagination: Pagination;
  pagesize = AppConstant.PAGE_SIZE;
  page = 1;
  sortField = VendorConstant.DEFAULT_SORT_FIELD;
  sortOrder = SortOrder.ASC;
  hidemenu = false;
  isvendor: boolean = false;
  searchData = null;
  isSearching: boolean = false; //selection key contains statusstore
  keyword: string = '';
  subscriptions = [];
  tabs = PurchaseTabs.tabs_vendor;
  test_data: any = null;
  statusNo: number = 0;
  paymentTermNo: number = 0;
  statusStore = []
  paymentTermStore = [];
  isSearch: boolean = false;

  readonly VENDOR_STATUS = AppConstant.VENDOR_STATUS;
  noRecordMsg: string;

  constructor(
    private router: Router,
    private location: Location,
    private vendorService: VendorService,
    private translateService: TranslateService,
    private authService: AuthService,
    private searchService: SearchService,
    private messageService: MessageService,
    private spinnerService: Ng4LoadingSpinnerService,
    private pageStateService: PageStateService,
    private dialog: MatDialog) {
    this.pagination = new Pagination();
  }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.initRole();
    // this.subscriptions[0] = this.messageService.getMessage().subscribe(x => {
    //   console.log(x);
    //    if (x.name == VendorConstant.EVENT_VENDOR_INVITED) {
    //      this.loadData(this.page);
    //    }
    // })
  }

  initRole() {
    this.spinnerService.show();
    this.authService.queryUserDetails().subscribe(
      user => {
        this.spinnerService.hide();
        if (user.id && this.authService.hasGroup(AppConstant.ROLE.PURCHASER)) {
          this.tabs = PurchaseTabs.tabs;
          this.isvendor = false;
          this.isSearchMode(); // change , keep the load state 
          this.loadState();
        }
        else if (this.authService.hasGroup(AppConstant.ROLE.VENDOR)) {
          this.tabs = PurchaseTabs.tabs_vendor;
          this.isvendor = true;
          this.vendor_content = '_';
          this.loadData();
        }
      },(err)=>{
        this.onError(err);
      })
  }

  isSelected(i) {
    let ls = this.statusSelectionList;
    let tmpls = this.statusStore;
    let b = false; 
    let key = ls[i].key;

    for (let j = 0; j < tmpls.length; j++){
      if (tmpls[j] == key) {
        b = true;
        break;
      }
    }
    return b;
  }

  isPTermSelected(i){
    let ls = this.paymentTermSelectionList;
    let tmpls = this.paymentTermStore;
    let b = false; 
    let key = ls[i].key;

    for (let j = 0; j < tmpls.length; j++){
      if (tmpls[j] == key) {
        b = true;
        break;
      }
    }
    return b;
  }

  searchVendor(event){
    this.spinnerService.show();
    this.keyword = event.target.value;
    if (this.keyword === null || this.keyword.length < 0) {
        return this.isSearchMode();
    } else {
      this.isSearch = true;
      this.isSearching = true;
      if (!this.isvendor) {
        this.searchFilter();
      }else{
        this.loadData();
      }
    }
  }

  searchFilter(page:number=1){
    this.isSearching = true;
    this.page = page;
    this.isSearch = (this.keyword != '' || this.statusStore.length > 0 || this.paymentTermStore.length>0)
    this.vendorService.search(this.keyword, this.statusStore.join(':'), this.paymentTermStore.join(':'),
      new Pager(this.page, AppConstant.PAGE_SIZE,
        [new Sort('status', this.sortOrder), new Sort(this.sortField, this.sortOrder)])).subscribe(
          (res: ResponseWrapper) => this.onSuccess(res),
          (res: ResponseWrapper) => this.onError(res)
        )
  }


  loadSavedState(){
    this.isSearching = true;
    this.isSearch = (this.keyword != '' || this.statusStore.length > 0 || this.paymentTermStore.length>0)
    this.vendorService.search(this.keyword, this.statusStore.join(':'), this.paymentTermStore.join(':'),
      new Pager(this.page, AppConstant.PAGE_SIZE,
        [new Sort('status', this.sortOrder), new Sort(this.sortField, this.sortOrder)])).subscribe(
          (res: ResponseWrapper) => this.onSuccess(res),
          (res: ResponseWrapper) => this.onError(res)
        )
  }

 isSearchMode(): boolean {
    if (this.isSearching && this.paymentTermStore.length<1 && this.statusStore.length<1) {
      this.loadState();
    } else {
      return
    }
    return this.isSearching = false
  }

  set paymentTermOption(j: number) {
    this.spinnerService.show();
    this.paymentTermNo = j;
    let element = null;
    let idx = -1;
    if (this.paymentTermStore.length > 0) {
      this.isSearch = true;
      for (let i = 0; i < this.paymentTermStore.length; i++) {
        if (j === this.paymentTermStore[i]) {
          element = this.paymentTermStore[i];
          idx = i;
          break;
        }
      }
      if (element != null) {
        var o = this.paymentTermStore.indexOf(j);
        if (o !== -1) { this.paymentTermStore.splice(o, 1) }
      }
      else {
        this.paymentTermStore.push(j);
      }
    } else {
      this.paymentTermStore.push(j);
    }
    this.searchFilter();
  }


  get paymentTermOption(): number {
    return this.paymentTermNo
  }

  set statusOption(j: number) {
    this.spinnerService.show();
    this.statusNo = j;
    let element = null;
    let idx = -1;
    if (this.statusStore.length > 0) {
      for (let i = 0; i < this.statusStore.length; i++) {
        if (j === this.statusStore[i]) {
          element = this.statusStore[i];
          idx = i;
          break;
        }
      }
      if (element != null) {
        var o = this.statusStore.indexOf(j);
        if (o !== -1) { this.statusStore.splice(o, 1) }
      }
      else {
        this.statusStore.push(j);
      }
    } else {
      this.statusStore.push(j);
    }
    this.searchFilter();
  }

  get statusOption(): number {
    return this.statusNo
  }

  /** 
   * @param page 
   * to display the list of vendor
   */
  loadData(page: number = 1) {
    this.spinnerService.show();
    this.page = page;
    this.vendors = [];
    this.vendorService.query(-1,
      new Pager(this.page, AppConstant.PAGE_SIZE,
        [new Sort('status', this.sortOrder), new Sort(this.sortField, this.sortOrder)]))
      .subscribe(
        (res: ResponseWrapper) => this.onSuccess(res),
        (res: ResponseWrapper) => this.onError(res)
      );
  }

  goto(ev) {
    this.saveState();
    if (this.isSearching) {
      this.isSearch = true;
      this.searchFilter(ev.pageIndex + 1);
      console.log('....');
    }else{
      this.loadData(ev.pageIndex + 1);
      console.log('111');
    }

  }


  /** 
   * @param vendor 
   * open the confirm dailog to ask for delete conformation
   */
  confirmRemoveVendor(vendor: Vendor) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        id: vendor.id,
        title: VendorLocaleConstant.VENDOR_CONFIRM_DELETE_TITLE,
        message: VendorLocaleConstant.VENDOR_CONFIRM_DELETE,
        button_yes: AppLocaleConstant.APP_BUTTON_YES,
        button_no: AppLocaleConstant.APP_BUTTON_NO
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // var totalRecord = this.pagination.totalRecords;
        // var newPage = totalRecord%this.pagesize;
        // if (newPage!<2) {
        //   this.pageStateService.v_page = this.page-1;
        //   this.page = this.page-1;
        // }
        this.removeVendor(result.id, vendor);
      }
    });
  }

  /**
   * @param vendor 
   * open the confirm dailog to ask for blacklist conformation 
   */
  confirmBlacklistVendor(vendor: Vendor) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        id: vendor.id,
        title: VendorLocaleConstant.VENDOR_CONFIRM_BLACKLIST_TITLE,
        message: VendorLocaleConstant.VENDOR_CONFIRM_BLACKLIST,
        button_yes: AppLocaleConstant.APP_BUTTON_YES,
        button_no: AppLocaleConstant.APP_BUTTON_NO
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.blacklistVendor(result.id, vendor);
      }
    });

    /**
     * @see Error_code_BlackList_Vendor
     * code = {
     * VND_0003: ' Failed blacklist vendor.", status code: 400',
     * VND_0002: ' Vendor profile not exist.", status code: 404'
     * }
     */
  }

  /**
   * @param id 
   * once got confrimed to delete then 
   * male delete request from here
   */
  removeVendor(id, vendor: Vendor) {
    this.spinnerService.show();
    this.vendorService.deleteVendor(id).subscribe(
      res => this.onRemoveSuccess(res, vendor),
      error => this.onError(error)
    );

    /**
     * @see Error_code_Delete_Vendor
     * code = {
     * VND_0004: ' Failed delete vendor. status code: 400',
     * VND_0002: 'Vendor profile not exist. status code: 404'
     * }
     */
  }
  /**
   * @param id once got confrimed to backlist then 
   * @param vendor male delete request from here
   */
  blacklistVendor(id, vendor: Vendor) {
    this.spinnerService.show();
    this.vendorService.blacklistVendor(id).subscribe(
      res => this.onBlacklistSuccess(res, vendor),
      error => this.onError(error)
    );
  }

  /**
   * @param vendor 
   * if the vendor is already
   */
  confirmReInviteVendor(vendor: Vendor) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        id: vendor.id,
        title: VendorLocaleConstant.VENDOR_CONFIRM_REINVITE_TITLE,
        message: VendorLocaleConstant.VENDOR_CONFIRM_RESEND_INVITAION,
        button_yes: AppLocaleConstant.APP_BUTTON_YES,
        button_no: AppLocaleConstant.APP_BUTTON_NO
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reInviteVendor(vendor);
      }
    });
  }

  /**
   * @param id once got confrimed to re-send-invite then 
   * @param vendor male delete request from here
   */
  reInviteVendor(vendor) {
    this.vendorService.reinviteVendor(vendor.id).subscribe(
      res => this.onReInviteSuccess(res, vendor),
      error => this.onError(error)
    )
    /** 
     * @see Error_Code_Reinvite_Vendor
     * error_codes = {
     * VND_0005: 'reinvited failed & status code = 400',
     * VND_0002: 'Vendor profile not exist. status code: 404'
     }
     **/
  }

  /**
   * @param id 
   * to view the vendor thier profi;e 
   */
  goView(id) {
    console.log('view ');
    this.saveState();
    this.router.navigate([`/vendor`, id]);
  }
  /**
   * @param id 
   * vendor to able to eadit
   */
  gotoEdit(id) {
    this.saveState();
    this.router.navigate(['/vendor-edit', id]);
  }

  resetFilter() {
    this.isSearch = false
    this.pageStateService.initVendor();
    this.loadState();
  }

  saveState() {
    this.pageStateService.v_page = this.page;
    this.pageStateService.v_sortField = this.sortField;
    this.pageStateService.v_sortOrder = this.sortOrder;
    this.pageStateService.v_searchData = this.keyword;
    this.pageStateService.v_paymentTermSelected = this.paymentTermStore;
    this.pageStateService.v_status = this.statusStore;
    this.pageStateService.v_save = true;
    this.pageStateService.vendor(this.page,this.sortField, this.sortOrder,this.keyword,this.paymentTermStore, this.statusStore)
  }


  loadState() {
    this.page = this.pageStateService.v_page;
    this.sortField = this.pageStateService.v_sortField;
    this.sortOrder = this.pageStateService.v_sortOrder;
    this.paymentTermStore = this.pageStateService.v_paymentTermSelected;
    this.statusStore = this.pageStateService.v_statusSelected;
    this.keyword = this.pageStateService.v_searchData;
    if (this.sortField == null) {
      this.sortField = VendorConstant.DEFAULT_SORT_FIELD;
    }
    if (this.pageStateService.v_save) {
      this.loadSavedState();
    }else{
      this.loadData();
    }
    this.pageStateService.initVendor();
  }

  private onSuccess(res: ResponseWrapper) {
    this.spinnerService.hide();
    this.vendors = res.data;
    this.pagination = parsePagination(res.headers);
    this.hasError = false;
    if(this.vendors.length==0) {
      this.noRecordMsg = 'No record found!';
    }
  }

  /**
   * @param error 
   * to display and map the error 
   */
  private onError(error: ResponseWrapper) {
    this.hasError = true;
    this.spinnerService.hide();
    this.translateService.get([
      AppLocaleConstant.APP_ERRORS_GENERAL_MESSAGE, VendorErrorLocalConstant.VENDOR_ERROR_VND_0002
    ])
      .subscribe(res => {
        if (error.data.error === 'VND_0002') {
          console.log(res[VendorErrorLocalConstant.VENDOR_ERROR_VND_0002]);
        } else {
          console.log(res[AppLocaleConstant.APP_ERRORS_GENERAL_MESSAGE]);
        }
      });
  }

  private onRemoveSuccess(res, vendor: Vendor) {
    this.spinnerService.hide();
    this.searchFilter();
  }

  private onReInviteSuccess(res, vendor) {
    this.spinnerService.hide();
    this.loadData(this.page);
  }

  private onBlacklistSuccess(res, vendor: Vendor) {
    this.spinnerService.hide();
    let v = this.vendors.find(k => k.id == vendor.id);
    v.status = VendorStatus.Blacklisted;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VendorInviteDialogComponent, {
      width: '450px',
      height: '450px',
      panelClass: 'test-db',
      data: { id: null }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.success === 1) {
          this.loadData(this.page);
        }
      } else {
        return
      }
    });
  }

  ngOnDestroy() {
    this.searchService.clearSearchOption();
    this.subscriptions.forEach((x: Subscription) => {
      x.unsubscribe();
    })
  }

  /**  @see Testing Dynomic Card layout for CERPA */
  // testCard(){
  //   this.child.hello('Rostam');
  // }
}  
 