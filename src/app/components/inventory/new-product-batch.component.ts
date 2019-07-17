import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from './inventory.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { AppConstant } from '../../shared';
@Component({
  selector: 'app-new-product-batch',
  templateUrl: './new-product-batch.component.html',
  styleUrls: ['./new-product-batch.component.css']
})
export class NewProductBatchComponent implements OnInit {
  fGroup: FormGroup;
  productName = '';
  productId = null;
  batchId = null;
  isEditMode = false;
  viewOnly = false;
  batchData: any;
  readonly appConstant = AppConstant;
  constructor(
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.createForm();
    this.productId = this.route.snapshot.params.prd_id;
    this.productName = this.route.snapshot.params.productName;
    this.batchId = this.route.snapshot.params.id;
    // && this.initPath() === 'add-batch')
    if (this.initPath() === 'add-batch') {
      this.isEditMode = false;
      this.viewOnly = false;
      // this.loadBatch(this.productId, this.batchId);
    } else if (this.initPath() === 'view-batch') {
      this.viewOnly = true;
      this.isEditMode = false;
      this.loadBatch(this.productId, this.batchId);
    } else if (this.initPath() === 'edit-batch') {
      this.viewOnly = false;
      this.isEditMode = true;
      this.loadBatch(this.productId, this.batchId);
    } else {
      this.viewOnly = false;
      this.isEditMode = false;
    }
  }

  initPath() {
    let p = null;
    this.route.url.subscribe((res) => {
      p = res[0].path;
    });
    return p;
  }

  loadBatch(prdId, batchId) {
    this.inventoryService.get_productBatch(prdId, batchId).subscribe((res) => {
      this.patchData(res);
      this.batchData = res;
    });
  }
  patchData(data) {
    this.fGroup.patchValue(
      {
        cost: data.cost,
        quantity: data.quantity,
        expiry_date: data.expiry_date
      });
  }
  requiredField() {
    if (this.isEditMode) {
      return null; // Validators.requiredTrue;
    } else {
      return null;
    }
  }
  createForm() {
    this.requiredField();
    this.fGroup = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      cost: [null, [Validators.required, Validators.min(0), Validators.pattern(this.appConstant.CUSTOM_VALIDATIONS.PRICE)]],
      manufactureDate: '',
      received_date: '',
      expiry_date: [null]
    });
  }
  get myForm() {
    return this.fGroup.controls;
  }

  minDate() {
    return new Date();
  }

  maxQty() {
    this.fGroup.controls['quantity'].setValue(this.fGroup.controls['quantity'].value + 1);
  }
  minQty() {
    if (this.fGroup.value.quantity > 1) {
      this.fGroup.controls['quantity'].setValue(this.fGroup.controls['quantity'].value - 1);
    }
  }

  submitForm(data) {
    if (this.isEditMode) {
      this.inventoryService.put_newProductBatch(data, this.productId, this.batchId).subscribe((res) => {
        this.router.navigate(['batch-list', this.productId, this.productName]);
      });
    } else {
      this.inventoryService.post_newProductBatch(data, this.productId).subscribe((res) => {
        this.router.navigate(['batch-list', this.productId, this.productName]);
      });
    }
  }

  back() {
    this.router.navigate(['batch-list', this.productId, this.productName]);
  }
}
