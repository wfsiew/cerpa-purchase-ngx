import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { VendorService } from './vendor.service';
import { VendorDetails } from './vendor.model';
import { AppLocaleConstant } from '../../../shared';
import { ResponseWrapper } from '../../../shared/models';
import { Location } from '@angular/common'
import { VendorErrorLocalConstant } from './vendor-locale.constant';

@Component({
  selector: 'app-vendor-view',
  templateUrl: './vendor-view.component.html',
  styleUrls: ['./vendor-view.component.css']
})
export class VendorViewComponent implements OnInit {
  id = null;
  vendor: VendorDetails;
  errorMessage: string;
  hasError = false;
  success_message = false;

  country: string;
  state: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private vendorService: VendorService,
    private translateService: TranslateService,
    private sb: MatSnackBar) {
    this.vendor = new VendorDetails();
  }

  /**
   * get the @see vendor_id from route to view the vendor details
   */
  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id != null) {
      this.load(this.id);
    }
  }

  /**
   * @param id 
   * view the @see vendor_details
   */
  load(id) {
    this.vendorService.queryDetails(id).subscribe(
      (res: ResponseWrapper) => this.onSuccess(res),
      (res: ResponseWrapper) => this.onError(res)
    );
  }

  /**
   * back to previous page
   */
  back() {
    this.location.back();
  }

  /**
   * @param res 
   * all success response 
   */
  private onSuccess(res: ResponseWrapper) {
    this.vendor = res.data;
    if (res.data.address.id !=null) {
      this.country = res.data.address.country.name;
      this.state = res.data.address.state.name;
    }
  }

  /**
   * @param error 
   * catch all @see error Response
   */
  private onError(error: ResponseWrapper) {
    this.translateResponseMessage(error)
  }

  /**
  * translate the response message to user
  */
  translateResponseMessage(resp): void {
    console.log(resp);
    this.translateService.get([VendorErrorLocalConstant.VENDOR_ERROR_VND_0002]).subscribe(
      (res) => {
        console.log(res);
        return this.showResponseMessage(res[VendorErrorLocalConstant.VENDOR_ERROR_VND_0002]);
      }
    )
  }
  /**
   * @param message 
   * @see display the response message for user
   */
  showResponseMessage(message: string): string {
    this.hasError = true;
    return this.errorMessage = message
  }

  // startSpinner() {
  //   var dailog = this.dialog.open(SpinnerDialogComponent, {
  //     panelClass: 'dialog-bg',
  //     disableClose: false
  //   });
  //   dailog.afterClosed().subscribe((res) => {
  //     console.log(res);
  //   })
  // }
  // stopSpinner() {
  //   this.spinnerService.changeMessage(true)
  // }
}
