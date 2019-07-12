import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductPricingService } from './product-pricing.service';
import { DialogData, TierPricingHistoryList, PromotionHistoryList } from './product-pricing.model';
import { AddProductComponent } from './vendor/add-product/add-product.component';
import { 
  Pagination, 
  SortOrder, 
  Sort, 
  AppConstant, 
  Pager,
  ResponseWrapper, 
  parsePagination } from '../../../shared';
  
  import { ProductPricingConstant } from './product-pricing.constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
  @Component({
    selector: 'app-product-pricing.history',
    templateUrl: './product-pricing.history.component.html',
    styleUrls: ['./product-pricing.history.component.css']
  })
  
  export class ProductPricingHistoryComponent implements OnInit {
  currentHistoryId :number;
  currentHistoryList :string;

  pageLimit: number = 5
  pagination: Pagination;
  isExpandedTier = -1;
  isExpandedPromo = -1;
  isTier:boolean=false;
  pagesize = AppConstant.PAGE_SIZE
  productID: number  = null;
  page = 1;
  sortField = ProductPricingConstant.DEFAULT_SORT_FIELD;
  sortOrder = SortOrder.ASC;
  historyList = [];
  listAllPromotion = [];
  listAllTier = [];
  @ViewChild(MatSort) sort: MatSort;
 
  displayedColumns: string[] = ['position', 'name', 'weight'];
  tierPricingList = [];
  promotionList = [];

  sectionTitle: string = "Tier Pricing History";
  isDisplayAll: boolean = false;

  constructor(
    private productService: ProductPricingService,
    private spinnerService: Ng4LoadingSpinnerService,
    public dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.pagination = new Pagination();
  }
  ngOnInit() {
    this.listHistory(1);
  }

  listHistory(page: number) {
    this.spinnerService.show();
    this.page = page;
    this.productService.queryListHistory(new Pager(page, this.pageLimit, [new Sort('status', this.sortOrder)]), this.data.id)
      .subscribe(
        (res: ResponseWrapper) => this.onSuccess(res),
        (res: ResponseWrapper) => this.onError(res)
      );
  }

  pricingHistory(page: number, v, inx) {
    this.tierPricingList = [];
    this.isExpandedTier = inx
      this.page = page;
      this.productService.queryTierPricingHistory(new Pager(page, this.pageLimit, [new Sort('status', this.sortOrder)]), v.id).subscribe(
        (res: ResponseWrapper) => this.onSuccessTierPricingHistory(res),
        (error: ResponseWrapper) => this.onError(error)
      )
  }

  onSuccessTierPricingHistory(res) {
    this.tierPricingList = res.data
    this.spinnerService.hide();
  }

  promotionHistory(page: number, v, inx) {
    this.promotionList = []
    this.isExpandedPromo = inx;
    this.page = page;
    this.productService.queryPromotionHistory(new Pager(page, this.pageLimit, [new Sort('status', this.sortOrder)]), v.id).subscribe(
      (res: ResponseWrapper) => this.onSuccessPromotionHistory(res),
      (error: ResponseWrapper) => this.onError(error)
    )
  }

  onSuccessPromotionHistory(res) {
    this.promotionList = res.data;
    this.spinnerService.hide();
  }


  viewAll(productID, option, page:number = 1){
    this.spinnerService.show();
    this.isDisplayAll = true;
    if (/^\d+$/.test(productID.id)) {
      if (option.type === 'tier') {
        this.currentHistoryList = option
        this.viewAllTier(productID, page)
        this.isTier = true;
      }else if(option.type === 'promo'){
        this.currentHistoryList = option
        this.viewAllPromotion(productID, page);
        this.isTier = false;
      }else{
        console.log('invalid');
        return
      }
    }    
  }
  viewAllPromotion(pid, page:number){
    this.currentHistoryId = pid;
    this.page = page;
    this.listAllPromotion = [];
    this.productID = pid.id
    this.productService.queryPromotionHistory(new Pager(page, AppConstant.PAGE_SIZE, [new Sort('status', this.sortOrder)]), pid.id).subscribe(
      (res: ResponseWrapper) => this.allPromotionListSuccess(res),
      (error: ResponseWrapper) => this.onError(error)
    )
  }
  viewAllTier(pid, page:number){
    this.currentHistoryId = pid;
    this.page = page;
    this.productID = pid.id
    this.listAllTier = [];
    this.productService.queryTierPricingHistory(new Pager(page, AppConstant.PAGE_SIZE, [new Sort('status', this.sortOrder)]), pid.id).subscribe(
      (res: ResponseWrapper) => this.allTierListSuccess(res),
      (error: ResponseWrapper) => this.onError(error)
    )
  }
  allTierListSuccess(res){
    this.pagination = parsePagination(res.headers);
    this.listAllTier = res.data;
    this.spinnerService.hide();
  }
  allPromotionListSuccess(res){
    this.pagination = parsePagination(res.headers);
    this.listAllPromotion = res.data;
    this.spinnerService.hide();
  }
 
  back(){
    this.isDisplayAll = false
  }

  onSuccess(res) {
    this.pagination = parsePagination(res.headers);
    this.historyList = res.data;
    this.spinnerService.hide();
  }

  onError(error) {
    console.log(error);
  } 

  goto(ev) {
    if (!this.isDisplayAll) {
      console.log('test 2');
      this.listHistory(ev.pageIndex+1)
    } else {
      console.log('test 2');
      this.viewAll(this.currentHistoryId, this.currentHistoryList, ev.pageIndex+1);

    }
  }

  onNoClick(value): void {
    this.dialogRef.close();
  }
}


