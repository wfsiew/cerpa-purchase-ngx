import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { ResponseWrapper, Pager, Pagination, AppConstant, SortOrder, Sort, parsePagination } from './../../../../shared';
import { LookUpData } from './look-up.model';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { PurchaseOrderService } from '../purchase-order.service';
import { AuthService } from '../../../../account/services/auth.service';
import { ProductPricingService } from '../../product-pricing';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-look-up-dialog',
  templateUrl: './look-up-dialog.component.html',
  styleUrls: ['./look-up-dialog.component.css']
})
export class LookUpComponent implements OnInit {
  search = new FormControl('', Validators.required);
  haseErr: boolean = false;
  SelectedList = [];
  

  searchTerm: FormControl = new FormControl();
  optionTerm: FormControl = new FormControl();

  filteredOptions: Observable<string[]>;
  pagination: Pagination;
  pagesize = AppConstant.PAGE_SIZE;
  page = 1;
  isvendor: boolean;
  lookUpData = [] //new LookUpData();
  term: string = '';
  searching: boolean = false;
  noResult:boolean = false;
  isSearching: boolean = true;
  isEmpty: boolean = false;
  isSelected: boolean = false;

  searchResult:any = [];

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<LookUpData>,
    @Inject(MAT_DIALOG_DATA) public data: LookUpData,
    private poService: PurchaseOrderService,
    private location: Location,
  ) {
    this.pagination = new Pagination();
  }

  ngOnInit() {
    this.initRole();
    this.isSearchMode();
    this.autoSearch('');
  }
 

  keyUpSearch(event){
    var term = event.target.value;
    this.autoSearch(term);
  }
  autoSearch(term){
    this.searching = true;
    this.noResult = false;
    this.poService.queryAutolookUp(term, this.data.id).subscribe(
      (res: any) => {
        console.log(res);
        this.searching = false;
        this.searchResult = res;
        if (this.searchResult.length<1) {
          this.noResult = true;
        }
      })
  }

  searchVendor(page: number = 1){
    this.page = page;
    this.term = this.searchTerm.value;
    if (this.term === null || this.term.length < 1) {
        return this.isSearchMode();
    } else {
      this.isSearching = true;
      this.page = page;
      this.poService.queryVendorLookUpList(new Pager(this.page,
        AppConstant.PAGE_SIZE), this.term, this.data.id).subscribe(
          (res: ResponseWrapper) => this.onSuccess(res),
          (res: ResponseWrapper) => this.onError(res)
        )
    }
  }

  isSearchMode(): boolean {
    if (this.isSearching) {
      this.LoadList(this.page,this.data.id);
    } else {
      return
    }
    return this.isSearching = false
  }

  initRole() {
    if (!this.authService.getUser()) {
      this.authService.queryUserDetails().subscribe(
        user => {
          if (user.id) {
            this.isvendor = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
            if (user.groups[0].name === AppConstant.ROLE.VENDOR || user.groups[0].name === AppConstant.ROLE.PURCHASER) {
              // this.LoadList();
            } else {
              this.dialogRef.close();
            }
          }
        }
      )
    }
    else {
      this.isvendor = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
      // this.LoadList();
    }
  }

  LoadList(page: number = 1, poId) {
    this.page = page;
    this.poService.queryVendorLookUpList(new Pager(this.page,
      AppConstant.PAGE_SIZE), this.term, poId).subscribe(
        (res: ResponseWrapper) => this.onSuccess(res),
        (res: ResponseWrapper) => this.onError(res)
      )
  }

  hasError(): boolean {
    if (this.search.valid) {
      return true
    }
    else {
      return false
    }
  }
  haseNullValue(): boolean {
    if (/^[\s]*$/.test(this.search.value.toString())) {
      return true
    } else {
      return false
    }
  }

  handleSelection(event) {
    this.SelectedList = event;
    // if (event.selected) {
    //   event.source.selectionList.options.toArray().forEach(element => {
    //     if (element.value.id != categorySelected.id) {
    //       element.selected = false;
    //       this.SelectedList = categorySelected;
    //     } else {
    //       this.SelectedList = categorySelected;
    //     }
    //   });
    // }
  }

  onNoClick(crf): void {
    if (crf.confirm === true && this.SelectedList.length != 0) {
      this.isSelected = true;
      this.dialogRef.close(this.SelectedList);
    } else if (crf.confirm === false) {
      this.isSelected = false;
      this.dialogRef.close();
    } else {
      this.isSelected = false;
      this.dialogRef.close();
    }
  }

  goto(ev) {
    this.LoadList(ev.pageIndex + 1, this.data.id);
  }

  private onSuccess(res: ResponseWrapper) {
    this.isSearching = false;
    this.lookUpData = res.data;
    this.pagination = parsePagination(res.headers);
    if (res.data.length === 0) {
      this.isEmpty = true;
    }
  }
  private onError(error: ResponseWrapper) {
    this.isEmpty = true;
    console.log(error);
  }

}
