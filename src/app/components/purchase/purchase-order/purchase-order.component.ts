import { Component, OnInit, ViewChild } from '@angular/core';
import { PurchaseTabs } from '../purchase.tabs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PurchaseOrderService } from './purchase-order.service';
import { MatPaginator, MatTableDataSource, getMatTooltipInvalidPositionError } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthService } from '../../../account/services/auth.service';
import { AppConstant, SortOrder, Pagination, OptionalSortingTerms, Pager, Sort, ResponseWrapper, parsePagination, PageStateService } from '../../../shared';
import { Location, DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';
import * as _ from 'lodash';
import { POStatus } from './view-po.component';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponents implements OnInit {
  tabs = PurchaseTabs.tabs;
  hasError: boolean = false;
  isVendor: boolean = false;
  material_picture: string = 'assets/images/default-m-icon/default-m-icon.png';
  displayedColumns: string[] = ['id', 'vendor', 'issued_date', 'status', 'action'];
  displayedVendorColumns: string[] = ['order_id', 'issued_date', 'status', 'action'];
  sortedData = []
  dataSource = new MatTableDataSource();
  page: number = 1;
  totalPage: number = 20;
  pageLenght: number = 0;
  pagesize = AppConstant.PAGE_SIZE
  sortOrder = SortOrder.ASC;
  pagination: Pagination;
  keyword: string = '';
  default_sort: any = { active: 'issued_date', direction: 'desc' };
  thamList = [];
  subscriptions = [];
  isSave: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  poStatus: string = '';
  selected: any[] = [];
  isSearch: boolean = false;
  issuedDate: string = '';
  statusList: any[] = [];
  fromDate: string = '';
  toDate: string = '';

  filterSelectionList = [
    { key: 0, value: 'Pending' },
    { key: 1, value: 'New' },
    { key: 2, value: 'In progress' },
    { key: 3, value: 'Delivering' },
    { key: 4, value: 'Delivered' },
    { key: 5, value: 'Completed' },
    { key: 6, value: 'Cancelled' },
    { key: 7, value: 'Rejected' }
  ];
  po_save: any;
  poSave: any;
  noRecordMsg: string;

  dateType = [
    { 'name': 'Single'},
    { 'name': 'Range'}
  ];
  chosenDate = this.dateType[0].name;
  todayDate = new Date();
  checkedDateType: any = 'Single';

  constructor(
    private authService: AuthService,
    private spinnerService: Ng4LoadingSpinnerService,
    private translateService: TranslateService,
    private pService: PurchaseOrderService,
    private router: Router,
    private location: Location,
    private pageService: PageStateService,
    private datePipe: DatePipe
  ) {
    this.pagination = new Pagination();
    this.sortedData = this.sortedData.slice();
  }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.initRole();
    this.loadState(this.pageService.po_page);
  }


  searchPO(event) {
    this.keyword = event.target.value;
    
    if (this.keyword.length < 1) {
      this.listPO()
    } else {
      this.pageService.po_page = 1;
      this.saveState();
      this.loadState();
    }
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

  listPO(page: number = 1) {
    this.spinnerService.show();
    this.page = page;
    this.pService.queryListing(-1, new Pager(this.page, AppConstant.PAGE_SIZE,
      [new Sort(this.default_sort.active, this.default_sort.direction)])).subscribe(
        (res: ResponseWrapper) => this.onSuccess(res),
        (res: ResponseWrapper) => this.onError(res)
      )
  }

  sortData(sort: any, page: number = 1) {
    this.spinnerService.show();
    this.page = page;
    this.default_sort = sort;
    this.pService.queryListing(-1, new Pager(this.page, AppConstant.PAGE_SIZE,
      [new Sort(sort.active,
        sort.direction)])).subscribe(
          (res: ResponseWrapper) => this.onSuccess(res),
          (res: ResponseWrapper) => this.onError(res)
        )
  }

  viewNewPO(POId) {
    this.saveState();
    this.router.navigate([`view-po/${POId.id}/po`]);
  }
  updateDeliveryStatus(POId){
    this.saveState();
    this.router.navigate([`delivery-status/${POId.id}`]);
  }

  invoiceDO(POId) {
    console.log('invoice');
    
    this.saveState();
    this.router.navigate(['/invoice-do', POId])
  }

  invoiceDelivered(POId) {
    this.saveState();
    this.router.navigate(['/invoice-do', POId, 'delivered-item'])
  }

  downloadPO(po) {
    this.pService.queryDownloadPO(po.id)
      .subscribe((file: Blob) => {
        FileSaver.saveAs(file, po.order_id);
      });
  }


  viewDeliveryOrder(data) {
    this.saveState();
    this.router.navigate(['delivery-order', data.id]);
  }

  thamnailImgList(thamList): any {
    return _.take(thamList, 2);
  }

  goto(ev) {
    if (!this.poSave) {
      this.listPO(ev.pageIndex + 1);
    } else {
      this.saveState();
      this.loadState(ev.pageIndex + 1);
    }
  }

  saveState() {
    this.pageService.po_page = this.page;
    // console.log('save state = '+ this.fromDate);

    // this.pageService.po_sortOrder = this.sortOrder;
    this.pageService.po_keyword = this.keyword;
    this.pageService.po_save = true;

    console.log(this.poStatus);

    this.pageService.po_status = this.poStatus;
    this.pageService.po_selected = this.selected;
    this.pageService.po_isSearch = this.isSearch;   
    this.pageService.po_fromDate = this.fromDate;
    this.pageService.po_toDate = this.toDate; 
    
    // this.pageService.po_sortField = this.sortField;
    // this.pageService.po_paymentTermSelected = this.paymentTermStore;
    // this.pageService.po_status = this.statusStore;
    // this.pageService.PO(this.page, this.keyword, true);
  }
  
  setDateType(event) {
    this.checkedDateType = event.value;
    this.loadState();
  }

  loadState(page: number = 1) {
    this.poStatus = this.pageService.po_status;
    this.fromDate = this.pageService.po_fromDate;
    this.toDate = this.pageService.po_toDate;
    this.selected = this.pageService.po_selected;
    this.isSearch = this.pageService.po_isSearch;
    this.poSave = this.pageService.po_save;
    
    if(this.checkedDateType==="Single"){
      if (this.fromDate !== '') {
        this.isSearch = true;
        if (this.toDate === '') {
          this.issuedDate = this.fromDate + ":" + this.fromDate;
        } else this.issuedDate = this.fromDate + ":" + this.toDate;
      }
    } else {
      if (this.fromDate !== '') {
        this.isSearch = true;
        if (this.toDate === '') {
          this.issuedDate = this.fromDate + ":" + this.datePipe.transform(this.todayDate,"yyyy-MM-dd");
        } else this.issuedDate = this.fromDate + ":" + this.toDate;
      } else {  
        if (this.toDate !== '') {   
          this.isSearch = true;
          this.issuedDate = this.toDate + ":" + this.toDate;
        } else {
          this.issuedDate = '';
        }
      }
    }

    this.page = page;
    this.keyword = this.pageService.po_keyword;
    this.pService.querySearchPO(this.keyword, this.poStatus, this.issuedDate, new Pager(this.page, AppConstant.PAGE_SIZE,
      [new Sort(this.default_sort.active,
        this.default_sort.direction)])).subscribe(
          (res: ResponseWrapper) => this.onSuccess(res),
          (res: ResponseWrapper) => this.onError(res)
        );
    this.pageService.initPO();
  }


  getStatus(i) {
    let s = `purchase.purchase-order.status.st${i}`;
    return s;
  }

  onSuccess(res) {
    // this.spinnerService.hide();
    // this.sortedData = res.data;
    // this.pagination = parsePagination(res.headers);
    // if(this.sortedData.length==0) {
    //   this.noRecordMsg = 'No record found!';
    // }

    this.spinnerService.hide();
    let tableArr: Element[] = res.data;
    this.pagination = parsePagination(res.headers);
    this.dataSource = new MatTableDataSource(tableArr);
    this.hasError = false;
    if (res.data.length == 0) {
      this.noRecordMsg = 'No record found!';
    }
  }

  onError(error) {
    this.hasError = true;
    this.spinnerService.hide();
  }

  getSelected(index) {
    return this.selected[index];
  }

  resetFilter() {
    this.keyword = '';
    this.poStatus = '';
    this.selected = [];
    this.isSearch = false;
    this.statusList = [];
    this.fromDate = '';
    this.toDate = '';

    this.saveState();
    this.loadState();
  }

  splitDate(d: string) {
    var s = [];
    s = d.split(':')
    if (s.length > 0) {
      if (s[0] != null) this.fromDate = s[0];
      if (s[1] != null) this.toDate = s[1];
    }
  }

  setSearchFilter(index) {
    // this.page = 1;
    this.selected[index] = !this.selected[index];
    if (this.selected[index]) {
      this.statusList.splice(index, 0, index);
    } else {
      var i = this.statusList.indexOf(index);
      this.statusList.splice(i, 1);
    }

    // console.log(this.statusList);
    

    if (this.statusList.length > 0) {
      this.isSearch = true;
      this.poStatus = '';
      this.statusList.forEach(element => {
        if (this.poStatus === '') {
          this.poStatus = element;
        } else {
          this.poStatus = this.poStatus + ":" + element;
        }
      });
    } else {
      this.poStatus = '';
      this.isSearch = false;
    }
    this.saveState();
    this.loadState();
  }

  setFromDate(event) {
    this.fromDate = event.target.value;
    this.saveState();
    this.loadState();
  }

  setToDate(event) {
    this.toDate = event.target.value;
    this.saveState();
    this.loadState();
  }

  viewPR(id) {
    this.saveState();
    this.router.navigate([`view-pr/${id}/po`]);
  }
}