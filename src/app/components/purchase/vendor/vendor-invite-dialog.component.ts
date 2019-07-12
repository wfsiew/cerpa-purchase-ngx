import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { VendorService } from './vendor.service';
import { VendorLocaleConstant, VendorErrorLocalConstant } from './vendor-locale.constant';
import { VendorConstant } from './vendor.constant';
import { MessageService, AppConstant, AppLocaleConstant, UIUtil, ResponseWrapper } from '../../../shared';
import { VendorInvite } from './vendor-invite.model';
import { Observable } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-vendor-invite-dialog',
  templateUrl: './vendor-invite-dialog.component.html',
  styleUrls: ['./vendor-invite-dialog.component.css']
})
export class VendorInviteDialogComponent implements OnInit {
  // spinner = falsex;
  data: any = {};
  vendorInvite: VendorInvite[];
  mform: FormGroup;
  hasError = false;
  errorMessage: string;

  // check the che exist email 

  constructor(
    private dialogRef: MatDialogRef<VendorInviteDialogComponent>,
    private fb: FormBuilder,
    private vendorService: VendorService,
    private spinner: Ng4LoadingSpinnerService,
    private translateService: TranslateService,
    private messageService: MessageService) {
    this.createForm();
  }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
  }

  /**
   * @see create_form_and_validation for invite vendor form
   */
  createForm() {
    this.mform = this.fb.group({
      company_name: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.COMPANY_NAME)]],
      contact_person: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.CONTACT_PERSON)]],
      email: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.EMAIL)]],
      conf_email: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.EMAIL)]]
    }, {validator: emailMatch}
    );
  }

  /**
   * submit form
   */
  submitInvite() {
    this.hasError = false;
    this.spinner.show();
    let fm = this.mform.value;
    if (fm.email != fm.conf_email) {
      this.translateService.get([VendorLocaleConstant.MISMATCH_EMAIL]).subscribe(
        (res) => {
          return this.showResponseMessage(res[VendorLocaleConstant.MISMATCH_EMAIL]);
        })
    this.spinner.hide()

    } else {
      let o = {
        company_name: fm.company_name,
        contact_person_name: fm.contact_person,
        email: fm.email,
      };
      this.vendorService.inviteVendor(o).subscribe(
        (res: ResponseWrapper) => this.onSuccess(res),
        (res: ResponseWrapper) => this.onError(res)
      )
    }
  }

  /**
   * @param s 
   * check form validation
   */
  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }

  /**
   * @param res 
   * success response for invite vendor
   */
  onSuccess(res) {
    this.spinner.hide();
    if (res) {
      return this.dialogRef.close({ success: 1 });
    }
  }

  /**
   * @param error 
   * @see response for any errors
   */

  onError(error) {
    this.spinner.hide();
    this.hasError = true;
    if (error.error.error === 'VND_0001') {
      return this.translateResponseMessage(error.error.error);
    } else {
      return this.showResponseMessage('Invite Vendor failed');
    }
  }
  closeDailog(_close) {
    this.dialogRef.close(_close);
  }

  /**
   * translate the response message to user
   */
  translateResponseMessage(resp): void {
    this.translateService.get([VendorErrorLocalConstant.VENDOR_ERROR_VND_0001]).subscribe(
      (res) => {
        console.log(res);
        return this.showResponseMessage(res[VendorErrorLocalConstant.VENDOR_ERROR_VND_0001]);
      }
    )
  }
  /**
   * @param message 
   * @see display the response message for user
   */
  showResponseMessage(message: string): string {
    return this.errorMessage = message
  }
}

export function emailMatch
  (control: AbstractControl): { [key: string]: boolean } {
  const pwd = control.get('email');
  const confirmPwd = control.get('conf_email');
    if (pwd.value === confirmPwd.value) {
      return null;
    }
  return { mismatch: null};
}