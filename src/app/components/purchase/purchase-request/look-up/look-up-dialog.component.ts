import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { ProductPricingService } from '../../product-pricing.service';
import { FormControl, Validators } from '@angular/forms';
import { ResponseWrapper, Pager,Pagination, AppConstant, SortOrder, Sort, parsePagination } from '../../../../shared';
import { LookUpData } from './look-up.model';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../../../account/services/auth.service';
import { ProductPricingService } from '../../product-pricing';

@Component({
  selector: 'app-look-up-dialog',
  templateUrl: './look-up-dialog.component.html',
  styleUrls: ['./look-up-dialog.component.css']
})
export class LookUpComponent implements OnInit {
  search = new FormControl('', Validators.required);
  haseErr: boolean = false;
  SelectedList = [];
  searching:boolean = false;
  noResult:boolean= false;
  searchTerm: FormControl = new FormControl();

  searchResult = [];

  filteredOptions: Observable<string[]>;
  pagination: Pagination;
  pagesize = AppConstant.PAGE_SIZE;
  page = 1;
  isvendor: boolean;
  lookUpData = [] //new LookUpData();
  term: string = ''
  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<LookUpData>,
    @Inject(MAT_DIALOG_DATA) public data: LookUpData,
    private productService: ProductPricingService,
    private location: Location,
  ) {
    this.pagination = new Pagination();
  }

  ngOnInit() {
    this.initRole();
    this.searchTerm.valueChanges.subscribe((data: any = []) => {
        this.term = data;
        if (data.length < 3) {
          return this.autoSearch('');
        } else {
         return this.autoSearch(data);
        }
      })
      this.autoSearch('');
  }
  autoSearch(term){
    this.searching = true;
    this.noResult = false;
    this.productService.queryLookAutoList(term).subscribe(
      (response: any = []) => {
        this.searching = false;
        this.searchResult = response;
        if (this.searchResult.length<1) {
          this.noResult = true;
        }
      })
  }
  setTermValue(){
    this.LoadList();
  }

  initRole() {
    if (!this.authService.getUser()) {
      this.authService.queryUserDetails().subscribe(
        user => {
          if (user.id) {
            this.isvendor = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
            if (user.groups[0].name === AppConstant.ROLE.VENDOR || user.groups[0].name === AppConstant.ROLE.PURCHASER) {
              this.LoadList();
            } else {
              this.dialogRef.close();
            }
          }
        }
      )
    }
    else {
      this.isvendor = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
      this.LoadList();
    }
  }

  LoadList(page: number = 1) {
    this.page = page;
    this.searching = true;
    this.productService.queryLookUpList(new Pager(this.page,
      AppConstant.PAGE_SIZE), this.term).subscribe(
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
      this.dialogRef.close(this.SelectedList);
    } else if (crf.confirm === false) {
      this.dialogRef.close();
    } else {
      this.dialogRef.close();
    }
  }

  goto(ev) {
      this.LoadList(ev.pageIndex + 1);
  }

  private onSuccess(res: ResponseWrapper) {
    this.lookUpData = res.data;
    this.searching = false;
    this.noResult = false;
    if (this.lookUpData.length<1) {
      this.noResult = true;
    }
    this.pagination = parsePagination(res.headers);
  }
  private onError(error: ResponseWrapper) {
    console.log('errpr',error);
    this.searching = false;
    // throw error
  }

}
