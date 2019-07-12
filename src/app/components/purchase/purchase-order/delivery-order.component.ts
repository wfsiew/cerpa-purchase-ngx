import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PurchaseOrderService } from './purchase-order.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as _ from 'lodash';

@Component({
  selector: 'app-delivery-order',
  templateUrl: './delivery-order.component.html',
  styleUrls: ['./delivery-order.component.css']
})

export class DeliveryOrderComponent implements OnInit {
  DODetails: any;
  Items: any = [];
  formG: FormGroup
  hasError: boolean = false;
  errorMessage: string = '';
  DOSTATUS = new DOStatus();
  totalQTY: number = 0;
  isSubmited: boolean = false;



  constructor(
    private location: Location,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private spinnerService: Ng4LoadingSpinnerService,
    private route: ActivatedRoute,
    private poService: PurchaseOrderService
  ) { }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    var id = this.route.snapshot.params.id;
    this.createForm();
    this.getDODetails(id);
  }

  createForm() {
    this.formG = this.fb.group({
      qtyFiled: [0, [Validators.required]]
    })
  }


  getDODetails(id) {
    this.spinnerService.show();
    this.poService.queryGetDODetails(id).subscribe(
      (res) => {
        this.DODetails = res;
        this.Items = this.DODetails.do_products;
        var v = _.sumBy(this.Items, 'quantity');
        this.totalQTY = v;
        this.spinnerService.hide();
      },
      (err) => {
        this.onError(err);
      }
    )
  }

  doDeliver() {
    this.spinnerService.show();
    this.isSubmited = true;
    var po_products = [];
    var minQty: number = 0;
    var id = this.route.snapshot.params.id;
    this.Items.forEach(element => {
      po_products.push(
        {
          id: element.id,
          quantity: element.quantity
        }
      )
      minQty += element.quantity
    });

    if (minQty > 0 && this.isSubmited) {
      this.poService.queryDoDeliver({ po_products: po_products }, id).subscribe(
        (res) => {
          this.getDODetails(id);
          this.hasError = false;
          this.spinnerService.hide();
          this.location.back();
        },
        (err) => {
          this.onError(err)
        }
      )
    } else {
      console.log('no data to deliver');
    }
  }
  back() {
    this.location.back();
  }

  minimizeQty(value, idx) {
    if (this.Items[idx].quantity > 0) {
      this.Items[idx].quantity = this.Items[idx].quantity - 1;
      var v = _.sumBy(this.Items, 'quantity');
      this.totalQTY = v;
    } else {
      return
    }
  }
  addQty(value, idx) {
    if (this.Items[idx].quantity < this.Items[idx].total_remaining_quantity) {
      this.Items[idx].quantity = this.Items[idx].quantity + 1;
      var v = _.sumBy(this.Items, 'quantity');
      this.totalQTY = v;
    } else {
      return
    }

  }

  // double check
  downloadDO() {
    var doId = this.route.snapshot.params.id;
    this.poService.querydownloadDO(doId)
      .subscribe((file: Blob) => {
        FileSaver.saveAs(file, `Delivery Order - ${this.DODetails.order_id}`);
      });
  }
  // saveAs(blb, filetype) {
  //   console.log(blb, filetype);
  // }

  printDO() {
    var doId = this.route.snapshot.params.id;
    this.poService.queryPrintDO(doId).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    })
  }

  onError(err: any) {
    this.spinnerService.hide();
    this.hasError = true
    this.errorMessage = err.error.message;
  }

  getStatus(status) {
    switch (status) {
      case 0: 
        return 'purchase.delivery-order.status.0'; 
      case 1: 
        return 'purchase.delivery-order.status.1';    
      case 2: 
        return 'purchase.delivery-order.status.2';     
      case 3: 
        return 'purchase.delivery-order.status.3'; 
      
    }
  }

  doStatus(status) {
    return this.getStatus(status)
  }

  // isDelivering(data):boolean{
  //   for (let i = 0; i < data.length; i++) {
  //     var arr =_.find(data, function(o) { return o.quantity });
  //     console.log(arr);

  //   }
  //   return true
  // }
}

export class DoItem {
  id: number;
  accepted_quantity: number;
  material: Material;
  price: number;
  quantity: number;
  subtotal: number;
  constructor() {
    this.material = new Material();
  }
}
class Material {
  id: number;
  name: string
}

export class DOStatus {
  new = 0;
  delivering = 1;
  delivered = 2;
  complete = 3;
}