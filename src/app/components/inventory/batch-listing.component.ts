import { Component, OnInit } from '@angular/core';
import { AppConstant, Pagination, Pager, parsePagination } from '../../shared';
import { Inventory } from './inventory.tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { InventoryService } from './inventory.service';
import { BatchesPageService } from '../../shared/services/inventory/inventory-state.service';
import { SortBatch } from './inventory.model';
import { MatDialog } from '@angular/material';
import { MessageDialogComponent } from '../../shared/components/message-dialog';
import * as _ from 'lodash';
@Component({
  selector: 'app-batch-listing',
  templateUrl: './batch-listing.component.html',
  styleUrls: ['./batch-listing.component.css']
})
export class BatchListingComponent implements OnInit {
  readonly appConstant = AppConstant;
  tabs = Inventory.tabs;
  productName  = '';
  batchList = [];
  sort: SortBatch;
  page = 1;
  pagination: Pagination;
  pagesize = AppConstant.PAGE_SIZE;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private pageState: BatchesPageService,
    private spinnerService: Ng4LoadingSpinnerService,
    private translateService: TranslateService,
    private inventoryService: InventoryService
  ) {
    this.pagination = new Pagination();
  }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.productName = this.route.snapshot.params.productName;
    this.loadState();
    // this.spinnerService.show();
  }

  sortData(sort) {
    this.sort = sort;
    this.loadState();
  }
  addProductBatch() {
    const id = this.route.snapshot.params.id;
    this.saveState();
    this.router.navigate(['add-batch', id, this.productName]);
  }

  editProductBatch(batchId) {
    this.saveState();
    const productId = this.route.snapshot.params.id;
    this.router.navigate(['edit-batch', productId , batchId, this.productName]);
  }

  loadPatchesState() {
    const id = this.route.snapshot.params.id;
    console.log(this.page);
    this.inventoryService.get_productBatches(id, new Pager(this.page, AppConstant.PAGE_SIZE,
      []), this.sort).subscribe((res: any) => {
      this.onSuccess(res);
    }, (err) => {
      this.onError(err);
    });
  }

  load() {
    const id = this.route.snapshot.params.id;
    this.inventoryService.get_productBatches(id, new Pager(this.page, AppConstant.PAGE_SIZE,
      []), this.sort).subscribe((res: any) => {
      this.onSuccess(res);
    }, (err) => {
      this.onError(err);
    });
  }

  saveState() {
    this.pageState.page = this.page;
    // this.pageState.sortBatch = this.sort;
    this.pageState.isSave = true;
  }

  loadState() {
    this.page = this.pageState.page;
    // this.sort = this.pageState.sortBatch;
    console.log(this.sort);
    if (this.pageState.isSave) {
      this.loadPatchesState();
    } else {
      this.load();
    }
  }

  goto(ev) {
    this.page = ev.pageIndex + 1;
      this.load();
  }

  onSuccess(res) {
    this.batchList = res.body;
    this.pagination = parsePagination(res.headers);
  }

  onError(err) {
    console.log(err);
  }

  dispose() {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '450px',
      data: {
        title: 'Dispose',
        button_yes: 'Submit',
        button_no: 'Discard'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!_.isUndefined(result)) {
        console.log('disposed');
      } else {
        console.log('error');
      }
    });
  }

  submitDispose() {
    this.inventoryService.delete_dispose(1, '').subscribe((res) => {
      console.log(res);
    });
  }
  initState() {
    this.page = 1;
    this.sort = null;
    this.pageState.isSave = false;
  }
}
