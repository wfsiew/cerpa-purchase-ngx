import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PurchaseOrderService } from './purchase-order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RejectReason } from './issue-po.model';
import { ResponseWrapper, AppConstant } from '../../../shared';
import { TranslateService } from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthService } from '../../../account/services/auth.service';
import { FormControl, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
 
@Component({
  selector: 'app-view-po',
  templateUrl: './view-po.component.html',
  styleUrls: ['./view-po.component.css']
})
export class ViewPurchaseOrderComponent implements OnInit {
  rejectRList: RejectReason[];
  hasError:boolean = false;
  viewPO: any;
  // rejectReasonInput:string = null;
  rejectReasonInput = new FormControl('');
  isvendor: boolean;
  poId: number;
  pRoute: string;
  pdfUrl: string;

  constructor(
    private location: Location,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthService,
    private poService: PurchaseOrderService,
    private confirmdialogService: ConfirmDialogService
  ) { }

  ngOnInit() {
    this.initRole();
    this.translateService.setDefaultLang('en');
    var id = this.route.snapshot.params.id;
    this.pRoute = this.route.snapshot.params.p;
    this.getPurchaseOrderDetails(id, this.pRoute);
    this.rejectReasonList();
  }

  initRole() {
    this.spinnerService.show();
    if (!this.authService.getUser()) {
      this.authService.queryUserDetails().subscribe(
        user => {
          if (user.id) {
            this.spinnerService.hide();
            this.isvendor = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
            if (this.isvendor) {
              this.spinnerService.hide();
            } else if (user.groups[0].name === AppConstant.ROLE.PURCHASER) {
              // console.log('pstaff 1');
              this.spinnerService.hide();
            } else {
              this.spinnerService.hide();
              //  this.location.back();
            }
          }
        }
      )
    }
    else {
      this.spinnerService.hide();
      this.isvendor = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
      if (this.isvendor) {
        console.log('vendor 1.1', this.isvendor);
      } else {
        console.log('pstaff 1.1');
      }
    }
  }

  showVendorDownloadInv() {
    return this.viewPO.status === AppConstant.PO_STATUS.DELIVERING && this.isvendor === true;
  }

  getPurchaseOrderDetails(id, p) {
    this.spinnerService.show();
    this.poService.queryGetPurchaseOrderDetails(id, p).subscribe(
      (res: any) => {
        this.spinnerService.hide();
        this.viewPO = res.body;
        this.poId = res.body.id;
      },
      (err) => {
        this.onError(err);
      }
    )
  }

  rejectReasonList() {
    this.spinnerService.show();
    this.poService.queryRejectReasonList().subscribe(
      (res: ResponseWrapper) => this.onRejectSuccess(res),
      (res: ResponseWrapper) => this.onError(res))
  }

  onRejectSuccess(res) {
    this.spinnerService.hide();
    this.rejectRList = res.data;
  }

  acceptPurchaseOrder(data) {
    this.spinnerService.show();
    this.poService.queryAcceptPurchaseOrder(data.id).subscribe(
      (res) => {
        this.spinnerService.hide();
        this.getPurchaseOrderDetails(this.poId, this.pRoute);
      }, (error) => {
        this.onError(error)
      }
    )
  }

  downloadPO(){
    this.poService.queryDownloadPO(this.poId)
    .subscribe((file: Blob) => {
      FileSaver.saveAs(file, this.viewPO.order_id);
    });
  }

  rejectPurchaseOrder(data) {
    this.spinnerService.show();
    var isNotNull = /^[\s]*$/.test(this.rejectReasonInput.value.toString());
    if (!isNotNull) {
      this.poService.queryRejectPurchaseOrder(data.id, this.rejectReasonInput.value).subscribe(
        (res) => {
          this.spinnerService.hide();
          this.getPurchaseOrderDetails(this.poId, this.pRoute);
        }, (err) => {
          this.onError(err)
        }
      )
    } else {
      console.log('you are required to select the reject reason');
      this.spinnerService.hide();
      return
    }
  }

  back() {
    this.location.back();
  }

  deliveryOrder() {
    this.router.navigate(['delivery-order', this.poId]);
  }

  printPO() {
    this.poService.queryPrintDO(this.poId).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    })
  }

  /**
   * AS VENDOR I WOULD LIKE TO DOWNLOAD INVOICE FOR DELIVERED ITEMS.
   */
  // downloadDeliveredInvoice() {
  //   this.poService.queryDownloadDeliveredInvoice(this.poId)
  //     .subscribe((file: Blob) => {
  //       FileSaver.saveAs(file, this.poId);
  //     });
  // }

  autoComplete(){
    this.confirmdialogService.openConfirmDialog('In order to complete the purchase order, please click the confirmation button below.')
    .afterClosed().subscribe(response =>{
      if(response){
        this.spinnerService.show();
        this.poService.autoComplete(this.poId)
        .subscribe(
          (res)=>{            
            console.log(res);            
            this.spinnerService.hide();
            var id = this.route.snapshot.params.id;
            this.getPurchaseOrderDetails(id, this.pRoute);
        },(error)=>{
          this.onError(error)
        });
      }     
    })

  }

  vendorDownloadInvoice() {
    this.poService.queryVendorDownloadInvoice(this.poId)
      .subscribe((file: Blob) => {
        FileSaver.saveAs(file, this.poId);
      });
  }

  invoiceDO() {
    this.router.navigate(['/invoice-do', this.poId])
  }

  invoiceDelivered() {
    this.router.navigate(['/invoice-do', this.poId, 'delivered-item'])
  }

  onError(err) {
    this.hasError = true;
    this.spinnerService.hide();
    console.log(err);
  }

  viewDeliveryStatus() {
    this.router.navigate([`delivery-status/${this.poId}`]);
  }
} 

export class POStatus{
  // VND_0029 already issued
}