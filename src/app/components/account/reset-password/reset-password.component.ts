import { Component, OnInit, Directive, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, AbstractControl, FormControl, FormGroupDirective, NgForm, ValidatorFn, ValidationErrors, NG_VALIDATORS, Validator } from '@angular/forms';
import { AccountService } from '../service';
import { TranslateService } from '@ngx-translate/core';
import { AppConstant } from '../../../shared';
import { ErrorStateMatcher } from '@angular/material';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit {

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

  formGroup: FormGroup;
  hasError: boolean = false;
  success: boolean = false;
  spinner: boolean = false;
  verifying: boolean = true;
  linkError: boolean = false;
  code: any;
  messageShow: boolean = false;
  numberClass: string = 'invalid'
  letterClass: string = 'invalid';
  specialClass: string = 'invalid';
  lengthClass: string = 'invalid';

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.spinner = true;
    this.createForm();
    this.checkResetCode();
  }

  createForm() {
    this.formGroup = this.fb.group(
      {
        password: ['', [Validators.required, Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.PASSWORD_VALIDATION)]],
        confirm_password: ['', [Validators.required]],
        code: [null, [Validators.required]]
      }, { validator: passwordValidator }
    )
  }

  checkResetCode() {    
    this.route.queryParams.subscribe((resp) => {
      // call check reset API
      // console.log(resp.code);      
      this.code = resp.code;
      this.formGroup.patchValue({ code: this.code });
      this.accountService.queryResetPasswordCode(resp.code).subscribe((resp) => {
        this.linkError = false;
        this.hasError = false;
        this.spinner = false;
        this.verifying = false;
      }, (err) => {
        this.hasError = true;
        this.linkError = true;
        this.spinner = false;
        this.verifying = false;
      });
    });
  }

  resetPassword() {
    let data = {
      password: this.formGroup.value.password,
      confirm_password: this.formGroup.value.confirm_password,
      code: this.formGroup.value.code
    }
    this.spinner = true;
    this.accountService.queryResetPassword(data).subscribe((resp) => {
      this.success = true;
      setTimeout(() => {
        this.back();
      }, 5000);
      this.spinner = false;
      this.hasError = false;
    }, (err) => {
      this.spinner = false;
      this.hasError = true;
    });
  }

  back() {
    this.router.navigate(['login']);
  }

  validate(event) {
    let value = event.target.value;

    // console.log('keyup  -> ',value);
    
    var numbers = /[0-9]/g;
    var letters = /[A-Za-z]/;
    var specials = /[@$!%*#?&]/;

    this.numberClass = (numbers.test(value)) ? 'valid' : 'invalid';
    this.letterClass = (letters.test(value)) ? 'valid' : 'invalid';
    this.specialClass = (specials.test(value)) ? 'valid' : 'invalid';
    this.lengthClass = (value.length > 7) ? 'valid' : 'invalid';
  }
}

export const passwordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const pass = control.controls.password.value
  const confirmPass = control.controls.confirm_password.value
  if (pass !== confirmPass) control.controls.confirm_password.setErrors({ 'mismatch': true });
  return pass === confirmPass ? null : { 'mismatch': true }
};