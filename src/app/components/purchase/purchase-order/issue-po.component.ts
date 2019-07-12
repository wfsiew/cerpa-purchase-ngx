import { Component, OnInit, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { PurchaseOrderService } from './purchase-order.service';
import { MatDialog, DialogPosition, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LookUpComponent } from './look-up/look-up-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../account/services/auth.service';
import { Location } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IssuePO } from './issue-po.model'
import { Pager, AppConstant, AppLocaleConstant } from '../../../shared';
import { ConfirmDialogComponent } from '../../../shared/components';
import { PurchaseRequestService } from '../purchase-request';
import * as _ from "lodash";
@Component({
  selector: 'app-issue-po',
  templateUrl: './issue-po.component.html',
  styleUrls: ['./issue-po.component.css']
})
@Output()
export class IssuePurchaseOrderComponent implements OnInit, OnDestroy {
  issuePoList = new IssuePO()
  material_name: string = '';
  qty = 0;
  dialogPosition: DialogPosition;
  setDefaultIssuePO = {};
  pr_materials = [];
  purchaseOrder = [];
  company_logo: string = 'assets/images/default-m-icon/default-m-icon.png';
  formgroup: FormGroup;
  prId: number = null;
  hasPrVondor: boolean = true;
  constructor(
    public dialog: MatDialog,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private router: Router,
    private pService: PurchaseOrderService,
    private location: Location,
    private route: ActivatedRoute,
    private prService: PurchaseRequestService
  ) { }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    var prId = this.route.snapshot.params.id;
    this.prId = prId;
    var saved = this.route.snapshot.params.saved
    var saveId = this.route.snapshot.params.saveId
    this.createForm();
    if (saved) {
      this.getSavedPO(saveId)
    } else if (prId) {
      this.getProductQuotations(null, prId);
    } else {
      this.location.back();
    }
  }

  /**
   * @param id by passing the pr_id to get the quatations po list
   */
  getProductQuotations(vendor_id, prid) {

    this.pService.queryGetQ(vendor_id, prid).subscribe((res: any) => {
      if (_.isEmpty(res)) {
        this.hasPrVondor = false;
      } else {
        this.issuePoList = res;
        this.setFormValue(res);
        this.setDefaultVendor(res);
      }
    })
  }

  /**
   * @param id by passing the pr_id to get the quatations po list
   */
  getSavedPO(saved_po) {
    this.prService.getSavedPO(saved_po).subscribe((res: any) => {
      if (_.isEmpty(res)) {
        this.hasPrVondor = false;
      } else {
        this.issuePoList = res;
        this.setFormValue(res);
        this.setDefaultVendor(res);
      }
    })
  }

  massageResponse(res) {
    var o = res.po_products;
    var ls = []
    o.forEach(element => {
      var x = {
        'quantity': element.quantity,
        'subtotal': element.subtotal,
        'vendor_product': {
          'price': element.price,
          'material': element.material
        }
      }
      ls.push(x);
    });

    this.issuePoList = res;
    this.issuePoList.po_products = ls;
    this.issuePoList.total_price = res.total;
    this.issuePoList.total_price_tax = res.grand_total;
  }

  savePO() {
    var o = this.issuePoList.po_products;
    o.forEach(element => {
      [
        {
          vendor_product: {
            id: element.vendor_product.id,
            price: element.vendor_product.price,
          },
          quantity: element.quantity,
          subtotal: element.subtotal,
        }
      ]
    });
    let data = {
      id: this.route.snapshot.params.id,
      vendor: {
        id: this.issuePoList.vendor.id
      },
      total_price: this.issuePoList.total_price,
      total_price_tax: this.issuePoList.total_price_tax,
      purchase_request: {
        id: this.issuePoList.purchase_request.id
      },
      po_products: o
    }

    this.spinnerService.show();
    this.pService.postSavedPO(this.prId, data).subscribe(
      (res) => {
        this.spinnerService.hide();
        this.location.back();
      },
      (err) => {
        this.onError(err)
      }
    )
  }

  deleteSavedPO() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        id: this.prId,
        title: AppLocaleConstant.DELETE_TITLE,
        message: AppLocaleConstant.DELETE_MESSAGE,
        button_yes: AppLocaleConstant.APP_BUTTON_YES,
        button_no: AppLocaleConstant.APP_BUTTON_NO
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.show();
        this.pService.deleteSavedPO(this.prId).subscribe(
          (res) => {
            this.spinnerService.hide();
            this.location.back();
          },
          (err) => {
            this.onError(err)
          }
        )
      }
    });
  }


  /**
   * @see passing the pr_id to get vendor from the look-up
   */
  setDefaultVendor(data, page: number = 1) {
    var vendorId = null
    vendorId = data.vendor.id;
    if (vendorId != null || vendorId != undefined) {
      this.pService.queryLoadDefualtVendor(vendorId).subscribe(
        (res: any) => {
          var result = res;
          if (result.company_logo != null) {
            this.company_logo = result.company_logo;
          } else {
            this.company_logo = this.company_logo;
          }
          this.formgroup.patchValue(
            {
              company_name: result.company_name,
              id: result.id,
              company_logo: result.company_logo
            }
          )
        },
        (erro) => {
          this.onError(erro);
        });
    }
  }
  openDialog() {
    var poId: number = this.route.snapshot.params.id;
    const dialogRef = this.dialog.open(LookUpComponent, {
      width: '600px',
      height: '500px',
      data: { id: poId },
      closeOnNavigation: false
    });
    dialogRef.afterClosed().subscribe(result => {
      this.requestForNewQuotations(result)
      if (result != undefined || result != null) {
        this.issuePoList.vendor.id = result.id;
        this.issuePoList.total_price = result.total_price;
        this.issuePoList.total_price_tax = result.total_price_tax;
        /**
         * @see after we got the date from look-up pass to @see setFormValue
         */
        this.setFormValue(result);
        if (result.company_logo != null) {
          this.company_logo = result.company_logo;
        } else {
          this.company_logo = this.company_logo;
        }
      } else {
        /**
         * @see if we cancel the dialog or get request failed just return 
         */
        return
      }
    });
  }

  requestForNewQuotations(data) {
    if (data == null || data == null) {
      return
    }
    var vendor_id = data.id;
    var pr_id = this.prId
    this.getProductQuotations(vendor_id, pr_id);
  }
  /**
 * @see after getting vendor now we are going putch it in the form to display for 
 * @see use as well as we can save data in an array
 */
  setFormValue(result) {
    this.formgroup.patchValue(
      {
        company_name: result.company_name,
        id: result.id,
        company_logo: result.company_logo,
        credit_limit: result.credit_limit,
        payment_term: result.payment_term,
        status: result.status,
        total_price: result.total_price,
        total_price_tax: result.total_price_tax
      }
    )
  }

  /**
   * @see Create form using formGroup angular
   */
  createForm() {
    this.formgroup = this.fb.group(
      {
        company_name: [null, [Validators.required]],
        id: [null, [Validators.required]],
        company_logo: [null, []],
        credit_limit: [null, []],
        payment_term: [null, []],
        status: [null, []],
        total_price: [null, []],
        total_price_tax: [null, []],
      }
    )
  }

  back() {
    this.location.back();
  }

  submitRequests() {
    this.spinnerService.show();
    if (this.issuePoList.vendor.id != null || this.issuePoList.vendor.id != undefined) {
      var o = this.issuePoList.po_products;
      o.forEach(element => {
        [
          {
            vendor_product: {
              id: element.vendor_product.id,
              price: element.vendor_product.price,
            },
            quantity: element.quantity,
            subtotal: element.subtotal,
          }
        ]
      });
      let body = {
        id: this.route.snapshot.params.id,
        vendor: {
          id: this.issuePoList.vendor.id
        },
        total_price: this.issuePoList.total_price,
        total_price_tax: this.issuePoList.total_price_tax,
        purchase_request: {
          id: this.issuePoList.purchase_request.id
        },
        po_products: o
      }
      this.checkCreditLimit(body);
      this.spinnerService.hide();

    } else {
      this.spinnerService.hide();
      return
    }
  }

  /**
   * 
   * @param data 
   * verify the credit limit 
   */
  checkCreditLimit(data) {
    this.pService.queryCheckCreditLimit(data.total_price, data.vendor.id).subscribe(
      (res: any) => {
        if (res.result === true) {
          // able to purchase 
          return this.purchaseNow(data)
        } else {
          // not able to purchase 
          return this.notifyAndPurchase(data);
        }
      },
      (err) => {
        this.onError(err)
      }
    )
  }

  /**
   * @param data 
   * processed purchasing when the credit limit is more then total amount
   */
  purchaseNow(data) {  // remane the function 
    this.spinnerService.show();
    this.pService.queryIssuePO(data).subscribe(
      (res) => {
        this.spinnerService.hide();
        this.location.back();
      },
      (err) => {
        this.onError(err)
      }
    )
  }

  /**
 * @param data 
 * processed purchasing after notify user when the credit limit is less then total amount
 */
  notifyAndPurchase(data) {
    var poId: number = this.route.snapshot.params.id;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      height: 'auto',
      data: {
        id: poId,
        title: AppLocaleConstant.CREDIT_TITLE,
        message: AppLocaleConstant.CREDIT_MESSAGE, // translate
        button_no: AppLocaleConstant.APP_BUTTON_NO,
        button_yes: AppLocaleConstant.APP_BUTTON_YES
      },
      closeOnNavigation: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null || result != undefined) {
        this.purchaseNow(data);
      } else {
        return
      }
    });
    this.spinnerService.hide();
  }

  /**
   * 
   * @param res 
   * if the result is success data will be listed here
   */
  onSuccess(res) {
    this.issuePoList = res.data;
    this.spinnerService.hide();
  }


  removed(it) {
    this.purchaseOrder.forEach((item, index) => {
      if (item.material_id === it) this.purchaseOrder.splice(index, 1);
    });
  }

  /**
  * 
  * @param res 
  * if the result is failed, the error will be catched here 
  */
  onError(error) {
    this.spinnerService.hide();
  }
  ngOnDestroy() { }
}