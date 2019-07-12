import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PurchaseOrderService } from './purchase-order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseWrapper, AppConstant } from '../../../shared';
import { TranslateService } from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthService } from '../../../account/services/auth.service';
import { FormControl, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-invoice-do',
  templateUrl: './invoice-do.component.html',
  styleUrls: ['./invoice-do.component.css']
})
export class InvoiceDeliveryOrderComponent implements OnInit {
  invoiceList: any;
  viewPO: any;
  hasError:boolean = false;
  haseSuccess:boolean = false;
  // rejectReasonInput:string = null;
  rejectReasonInput = new FormControl('');
  isvendor: boolean;
  ivId: number;
  invo:string;
  isDeliveredInvoice:boolean = false;
  isInvoiceAll:boolean = false; 
  isLatestInvoice:boolean = false; // for pstaff

  constructor(
    private location: Location,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthService,
    private poService: PurchaseOrderService
  ) { }
  ngOnInit() {
    this.initRole();
    this.translateService.setDefaultLang('en');
    this.ivId = this.route.snapshot.params.id;
    this.invo = this.route.snapshot.params.inv;
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
              // this.getInvoice();
              this.setInvoice(true);
              this.spinnerService.hide();
            } else if (user.groups[0].name === AppConstant.ROLE.PURCHASER) {
              // this.pstaffGetInvoice();
              this.setInvoice(false);
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
        this.setInvoice(true);
        // this.getInvoice();
      } else {
        this.setInvoice(false);
        // this.pstaffGetInvoice();
      }
    }
  }

  setInvoice(isVendor: boolean) {
    var inv = this.route.snapshot.params.inv;
    if (inv==='delivered-item') {
      return this.getDeliveredItemInvoice();
    } else {
      if (isVendor) {
        return this.getInvoice();
      } else {
        return this.pstaffGetInvoice();
      }
    }
  }

  getDeliveredItemInvoice() {
    var id = this.route.snapshot.params.id;
    this.poService.getDeliveredInvoiceItem(id).subscribe(
      (res: any) => {
        this.onSuccess(res);
      },
      (erro) => {
        this.onError(erro)
      }
    )
  }

  getInvoice() {
    var ivId = this.route.snapshot.params.id;
    this.poService.queryGetInvoice(ivId).subscribe(
      (res: any) => {
        this.onSuccess(res);
      },
      (erro) => {
        this.onError(erro)
      }
    )
  }

  pstaffGetInvoice() {
    var id = this.route.snapshot.params.id;
    this.poService.getLatestInvoice(id).subscribe(
      (res: any) => {
        this.onSuccess(res);
      },
      (erro) => {
        this.onError(erro)
      }
    )
  }

  issueInvoice() {
    var id = this.route.snapshot.params.id;
    var inv = this.route.snapshot.params.inv;
    if (inv === 'delivered-item') {
      this.poService.issueDeliveredInvoiceItem(id).subscribe((res) => {
        this.onSuccessIssue(res)
      }, (err) => {
        this.onError(err)
      })
    }else{
      this.poService.queryIssueInvoice(id).subscribe((res) => {
        this.onSuccessIssue(res)
      }, (err) => {
        this.onError(err)
      })
    }
  }

  onSuccessIssue(res){
    this.haseSuccess = true;
  }

  pStaffDownloadInvoice() {
    var id = this.route.snapshot.params.id;
    this.poService.queryDownloadInvoice(id).subscribe((file: Blob) => {
      FileSaver.saveAs(file, this.invoiceList.invoice_ref);
    });
  }

  downloadInvoice() {
    var id = this.route.snapshot.params.id;
    if (this.isvendor) {
      this.poService.queryDownloadDeliveredInvoice(id,this.invo).subscribe((file: Blob) => {
        FileSaver.saveAs(file, this.invoiceList.invoice_ref);
      });
    }else{
      this.poService.queryDownloadInvoice(id).subscribe((file: Blob) => {
        FileSaver.saveAs(file, this.invoiceList.invoice_ref);
      });
    }
  }

  onSuccess(res) {
    this.invoiceList = res;
    this.spinnerService.hide();
  }

  onError(err) {
    this.spinnerService.hide();
    this.hasError = true;
  }

  back() {
    this.location.back();
  }
} 