import { Component, OnInit, ViewChild, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../service';
import { ConfirmDialogComponent } from '../../../shared/components';
import { Vendor, VendorLocaleConstant } from '../../purchase';
import { AppLocaleConstant, AppConstant } from '../../../shared';
import { AccountLocalConstant } from '../account-locale.constant';
import { MatDialog } from '@angular/material';
import { routerNgProbeToken } from '@angular/router/src/router_module';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  formGroup: FormGroup;
  success: boolean = false;
  spinner: boolean = false;
  sec: number = 5;
  hasError: boolean = false;

  constructor (
    private fb: FormBuilder,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.createForm();
    // this.checkResetCode();
    // this.validate();
  }

  createForm() {
    this.formGroup = this.fb.group(
      {
        email: ['', [Validators.required,Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.EMAIL)]]
      }
    )
  }

  submitForm() {
    // call forgot password API
    this.spinner = true;
    let data = {
      username: this.formGroup.value.email
    }
    this.accountService.queryForgotPassword(data).subscribe((resp) => {
      this.success = true;
      this.spinner = false;
      var x = setInterval(() => {
        this.sec--;
        if (this.sec == 0) {
          clearInterval(x);
          this.back();
        }        
      }, 1000);
    }, (err) => {
      this.spinner = false;
      this.hasError = true;
    });
  }

  back() {
    this.router.navigate(['login']);
  }
}

