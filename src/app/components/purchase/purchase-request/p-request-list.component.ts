import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { PurchaseTabs } from '../purchase.tabs';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { PurchaseRequestService } from './purchase-request.service';
import {
  Pager, Sort, ResponseWrapper, Pagination, parsePagination, SortOrder,
  AppConstant, AppLocaleConstant, MessageService, PageStateService
} from '../../../shared';
import { PurchaseRequestConstant } from './purchase-request.constant';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../../shared/components';
import { AuthService } from '../../../account/services/auth.service';
import { Location, DatePipe } from '@angular/common';
import { AccountLocalConstant } from '../../account/account-locale.constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Sort as ngSort } from '@angular/material';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
@Component({
  selector: 'app-p-request-list',
  templateUrl: './p-request-list.component.html',
  styleUrls: ['./p-request-list.component.css']
})

export class PurchaseRequestListComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource();
  message: string = '';
  hasError: boolean = false;
  pagination: Pagination;
  pagesize = AppConstant.PAGE_SIZE
  tabs = PurchaseTabs.tabs;
  page: number = 1;
  totalPage: number = 20;
  // pageLenght: number = 0;

  sortField = PurchaseRequestConstant.DEFAULT_SORT_FIELD;
  displayedColumns = [];
  selected = [];
  default_sort: any = { active: 'issued_date', direction: 'desc' };

  @ViewChild(MatSort) sort: MatSort;

  columnNames = [
    { id: "id", value: PurchaseRequestConstant.TABLE_COL_NAME.ID },
    { id: "requested_by", value: PurchaseRequestConstant.TABLE_COL_NAME.REQUESTED_BY },
    { id: "issued_date", value: PurchaseRequestConstant.TABLE_COL_NAME.ISSUED_DATE },
    { id: "status", value: PurchaseRequestConstant.TABLE_COL_NAME.STATUS },
    { id: "action", value: PurchaseRequestConstant.TABLE_COL_NAME.ACTION }
  ];
  keyword = '';
  isSearch: boolean = false;

  filterSelectionList = [
    { key: 0, value: "In Progress" },
    { key: 1, value: "Issued PO" },
    { key: 2, value: "Delivered" },
    { key: 3, value: "Completed" },
    { key: 4, value: "Cancelled" },
    // { key: 5, value: "Saved PO" }
  ]

  statusList: any = [];
  prStatus: any = '';
  issuedDate: any = '';
  fromDate: string = '';
  toDate: string = '';
  listLoaded: boolean = true;
  saved_po: boolean = false;
  searchData = { term: this.keyword, status: this.prStatus, issuedDate: this.issuedDate, saved_po: this.saved_po }

  readonly PR_STATUS = AppConstant.PR_STATUS;
  noRecordMsg: string;

  dateType = [
    { "name": "Single"},
    { "name": "Range"}
  ]
  chosenDate = this.dateType[0].name;
  todayDate = new Date();
  today = this.datePipe.transform(this.todayDate,"yyyy-MM-dd");
  checkedDateType: any = 'Single';


  constructor(
    private translateService: TranslateService,
    private prService: PurchaseRequestService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private location: Location,
    private spinnerService: Ng4LoadingSpinnerService,
    private pService: PurchaseOrderService,
    private pageState: PageStateService,
    private datePipe: DatePipe
  ) {
    this.pagination = new Pagination();
  }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.displayedColumns = this.columnNames.map(x => x.id);
    this.initRole();
    this.loadState();
  }

  /**
 * checking the users rule if the rule is not matched 
 * @see initRole() will automatically send back to previous page
 */
  initRole() {
    if (!this.authService.getUser()) {
      this.authService.queryUserDetails().subscribe(
        user => {
          if (user.groups[0].name === AppConstant.ROLE.PURCHASER) {
            this.tabs = PurchaseTabs.tabs;
          } else {
            this.location.back();
          }
        }
      ),
        ((err) => {
          this.onError(err)
        })
    }
    else {
      if (this.authService.hasGroup(AppConstant.ROLE.PURCHASER)) {
        this.tabs = PurchaseTabs.tabs;
      } else if (this.authService.hasGroup(AppConstant.ROLE.PURCHASER)) {
        this.tabs = PurchaseTabs.tabs_vendor;
      } else {
        this.hasError = true;
      }
    }
  }

  saveState() {
    this.pageState.pr_page = this.page;
    this.pageState.pr_keyword = this.keyword;
    this.pageState.pr_status = this.prStatus;
    this.pageState.pr_issuedDate = this.issuedDate;
    this.pageState.pr_selectedStatus = this.selected;
    this.pageState.pr_statusList = this.statusList;
    this.pageState.pr_save = true;
    this.pageState.pr_saved_po = this.saved_po;
    this.pageState.pr_isSearch = this.isSearch;
    // this.pageState.PR(this.page, this.keyword, this.prStatus, this.issuedDate, this.selected, this.statusList, true)
  }

  loadState() {
    this.page = this.pageState.pr_page;
    this.keyword = this.pageState.pr_keyword;
    this.prStatus = this.pageState.pr_status;
    this.issuedDate = this.pageState.pr_issuedDate;
    this.selected = this.pageState.pr_selectedStatus;
    this.isSearch = this.pageState.pr_isSearch;
    this.statusList = this.pageState.pr_statusList;
    this.saved_po = this.pageState.pr_saved_po;
    this.splitDate(this.issuedDate);

    if (this.pageState.pr_save) {
      this.loadSavedState();
    }
    else {
      this.listPR();
    }
    this.pageState.initPR()

  }

  loadSavedState() {
    this.searchData = { term: this.keyword, status: this.prStatus, issuedDate: this.issuedDate, saved_po: this.saved_po }
    this.prService.searchPR(this.searchData, new Pager(this.page, AppConstant.PAGE_SIZE,
      [])).subscribe(
        (res: ResponseWrapper) => this.onSuccess(res),
        (res: ResponseWrapper) => this.onError(res)
      )
  }

  splitDate(d: string) {
    var s = [];
    s = d.split(':')
    if (s.length > 0) {
      if (s[0] != null) this.fromDate = s[0];
      if (s[1] != null) this.toDate = s[1];
    }
  }

  resetFilter() {
    this.keyword = '';
    this.prStatus = '';
    this.selected = [];
    this.isSearch = false;
    this.statusList = [];
    this.fromDate = '';
    this.toDate = '';
    this.saved_po = false;
    this.issuedDate = '';
    this.saveState()
    this.loadState()

    // this.executeSearch(1);
  }

  /**
   * @param page 
   * listing purhcase request list
   */
  listPR(page: number = 1) {
    this.spinnerService.show();
    this.page = page;
    // this.toDate = '';
    // this.fromDate = '';
    this.prService.queryPRList(-1, new Pager(page, AppConstant.PAGE_SIZE,
      [new Sort(this.sortField, this.default_sort.direction)])).subscribe(
        (res: ResponseWrapper) => this.onSuccess(res),
        (err: ResponseWrapper) => this.onError(err)
      );
  }

  sortData(sort: ngSort) {
    this.spinnerService.show();
    this.default_sort = sort;
    this.prService.queryPRList(-1, new Pager(this.page, AppConstant.PAGE_SIZE,
      [new Sort(sort.active,
        sort.direction)])).subscribe(
          (res: ResponseWrapper) => this.onSuccess(res),
          (res: ResponseWrapper) => this.onError(res)
        )
  }

  viewPR(id) {
    this.saveState();
    this.router.navigate([`view-pr/${id}/pr`]);
  }

  editPR(id) {
    this.saveState();
    this.router.navigate([`edit-pr/${id}`]);
  }

  /**
   * @see Reissue_Purchase_Order
   */
  reissuePO(id) {
    this.saveState();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        id: id,
        title: PurchaseRequestConstant.REISSUE_PURCHASE_ORDER_TITLE,
        message: PurchaseRequestConstant.REISSUE_PURCHASE_ORDER_MESSAGE,
        button_yes: AppLocaleConstant.APP_BUTTON_YES,
        button_no: AppLocaleConstant.APP_BUTTON_NO
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        var v = /^\d+$/.test(result.id);
        if (v) {
          // this.prService.queryCancelPR(result.id).subscribe(
          this.prService.queryCancelPO(result.id).subscribe(
            (res) => {
              this.listPR()
              this.saveState();
              this.router.navigate([`./issue-po/${id}`])
            },
            (err) => {
              this.onError(err)
            }
          )
        } else {
          this.onError('error')
        }
      } else {
        return
      }
    });
  }

  issuePR() {
    this.saveState();
    this.router.navigate([`issue-pr`]);
  }

  viewPO(id) {
    this.saveState();
    this.router.navigate([`view-po/${id}/pr`]);
  }

  issuePO(prId) {
    this.saveState();
    var totalRecord = this.pagination.totalRecords;
    var newPage = totalRecord % this.pagesize;
    if (newPage! < 2 && totalRecord > 1 && this.page > 1) {
      this.pageState.pr_page = this.page - 1;
    }

    this.router.navigate([`issue-po/${prId}`]);
  }

  issuePOSaved(prId, saved_po) {
    this.saveState();
    this.router.navigate([`issue-po/${prId}/saved/${saved_po}`]);
  }

  cancelPR(id) {
    this.saveState();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        id: id,
        title: PurchaseRequestConstant.CANCEL_PURCHASE_REQUEST_TITLE,
        message: PurchaseRequestConstant.CANCEL_PURCHASE_REQUEST_MESSAGE,
        button_yes: AppLocaleConstant.APP_BUTTON_YES,
        button_no: AppLocaleConstant.APP_BUTTON_NO
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        var v = /^\d+$/.test(result.id);
        if (v) {
          this.prService.queryCancelPR(result.id).subscribe(
            (res) => {
              this.loadSavedState()
            },
            (err) => {
              this.onError(err)
            }
          )
        } else {
          this.onError('error')
        }
      } else {
        return
      }
    });
  }

  cancelPO(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        id: id,
        title: PurchaseRequestConstant.CANCEL_PURCHASE_ORDER_TITLE,
        message: PurchaseRequestConstant.CANCEL_PURCHASE_ORDER_MESSAGE,
        button_yes: AppLocaleConstant.APP_BUTTON_YES,
        button_no: AppLocaleConstant.APP_BUTTON_NO
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.prService.queryCancelPO(result.id).subscribe(
          (res) => {
            this.loadSavedState();
          },
          (err) => {
            this.onError(err)
          }
        )
      } else {
        return
      }
    });
  }

  onSuccess(res) {
    this.spinnerService.hide();
    let tableArr: Element[] = res.data;
    this.pagination = parsePagination(res.headers);
    this.dataSource = new MatTableDataSource(tableArr);
    // this.dataSource.sort = this.sort;
    this.hasError = false;
    if (res.data.length == 0) {
      this.noRecordMsg = 'No record found!';
    }
  }

  onError(error) {
    this.hasError = true;
    this.spinnerService.hide();
  }

  goto(ev) {
    console.log();
    if (this.isSearch) {
      this.executeSearch(ev.pageIndex + 1);
    } else {
      this.listPR(ev.pageIndex + 1)
    }
  }

  translateResponseMessage(err): void {
    this.translateService.get([
      AccountLocalConstant.GEN_0007,
    ]).subscribe(
      (error_message) => {
        if (err.error.error === 'GEN_0007') {
          return this.showResponseMessage(error_message[AccountLocalConstant.GEN_0007])
        } else {
          return this.showResponseMessage("Opps something went wrong")
        }
      }
    )
  }

  showResponseMessage(message: string): string {
    return this.message = message
  }

  searchPR(event, page: number = 1) {
    this.page = page;
    this.keyword = event.target.value;

    if (this.keyword === '') {
      if (this.saved_po == false && this.statusList.length == 0) {
        this.isSearch = false;
      } else {
        this.isSearch = true;
      }
      if (!this.listLoaded) {
        // this.listPR();
        // this.executeSearch();
        this.listLoaded = true;
      }
    } else {
      this.isSearch = true;
      this.listLoaded = false;
      // this.executeSearch();
    }
    this.executeSearch();
  }

  setDateType(event) {
    this.checkedDateType = event.value;
    this.executeSearch();
  }

  executeSearch(page: number = 1) {
    if(this.checkedDateType==="Single"){
      if (this.fromDate !== '') {
        this.isSearch = true;
        this.issuedDate = this.fromDate + ":" + this.fromDate;
      }
    } else {
      if (this.fromDate !== '') {
        this.isSearch = true;
        if (this.toDate === '') {
          this.issuedDate = this.fromDate + ":" + this.today;
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
    this.searchData = { term: this.keyword, status: this.prStatus, issuedDate: this.issuedDate, saved_po: this.saved_po }
    this.prService.searchPR(this.searchData, new Pager(this.page, AppConstant.PAGE_SIZE,
      [])).subscribe(
        (res: ResponseWrapper) => this.onSuccess(res),
        (res: ResponseWrapper) => this.onError(res)
      )
  }

  getSelected(index) {
    return this.selected[index];
  }

  getSelectedSave(): boolean {
    return this.saved_po
  }

  setSearchFilter(index) {

    this.selected[index] = !this.selected[index];
    if (index != 5) {
      if (this.selected[index]) {
        this.statusList.splice(index, 0, index);
      } else {
        var i = this.statusList.indexOf(index);
        this.statusList.splice(i, 1);
      }

      if (this.statusList.length > 0) {
        this.isSearch = true;
        this.prStatus = '';
        this.statusList.forEach(element => {
          if (this.prStatus === '') {
            this.prStatus = element;
          } else {
            this.prStatus = this.prStatus + ":" + element;
          }
        });
      } else {
        this.prStatus = '';
        if (this.saved_po == false && this.statusList.length == 0 && this.keyword == '') {
          this.isSearch = false;
        } else {
          this.isSearch = true;
        }
      }
    }
    // else {
    //   this.saved_po = this.selected[index];
    //   this.isSearch = this.saved_po;
    // }
    this.executeSearch(1);
  }

  // checkPO(){}

  savedPO(event) {
    this.saved_po = !this.saved_po
    event.selected = this.saved_po;
    this.page = 1;
    this.saved_po = event.selected;
    if (this.saved_po == false && this.statusList.length == 0 && this.keyword == '') {
      this.isSearch = false;
    } else {
      this.isSearch = true;
    }
    this.saveState();
    this.loadState();
  }

  deleteSavedPO(id) {
    this.saveState();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        id: id,
        title: AppLocaleConstant.DELETE_TITLE,
        message: AppLocaleConstant.DELETE_MESSAGE,
        button_yes: AppLocaleConstant.APP_BUTTON_YES,
        button_no: AppLocaleConstant.APP_BUTTON_NO
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.show();
        this.pService.deleteSavedPO(id).subscribe(
          (res) => {
            // this.listPR();
            this.loadSavedState();
            this.spinnerService.hide();
          },
          (err) => {
            this.onError(err)
          }
        )
      }
    });
  }

  setSearchFilterButton(index) {
    // console.log(index);
  }

  toggle(val) {
    return !val;
  }

  setFromDate(event) {
    this.fromDate = event.target.value;
    this.executeSearch(1);
  }

  setToDate(event) {
    this.toDate = event.target.value;
    this.executeSearch(1);
  }

  getStatus(i) {
    let s = `purchase.purchase-request.status.st${i}`;
    return s;
  }

  ngOnDestroy() { }
}

export interface Element {
  id: number
  register: string,
  issued_date: string,
  status: string,
  action: string,
}