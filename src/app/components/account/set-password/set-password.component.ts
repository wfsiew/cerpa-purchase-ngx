import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../service';
import { Router, ActivatedRoute } from '@angular/router';
import { SetPassword } from './set-password.model';
import { AccountLocalConstant } from '../account-locale.constant';
import { AppConstant } from '../../../shared';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {
  mform: FormGroup;
  activation_code = null;
  hasError = false
  message: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private accountService: AccountService
  ) {
  }
  /* see codes for set password 
    {
      GEN_0006: 'vendor activation link has expired, redirect to pervois page no dispaly error message',
      ast_step:  'password (enum, ex: 0,1)',
      GEN_0002: 'Minimum length of 8',
      GEN_0003: 'Not common password (e.g. password)',
      GEN_0004: 'Not similar with the username',
      GEN_0005: 'Combination of alphanumeric and special char (spaces not allowed)'
    } 
  **/
  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.creatForm();
    this.checkActivation();
  }

  /**
   * @param check_activation_code
   * to check the link steps and expiry 
   */
  checkActivation() {
    this.spinnerService.show();
    this.route.queryParams.subscribe(
      (resp) => {
        this.accountService.queryCheckActivationUrl(resp.code).subscribe(
          (res: any) => {
            if (res.step === 0 && res.id != null) {
              return this.router.navigate(['register'], { queryParams: { code: resp.code } })
            }
            else if (res.step === null && res.id != null) {
              this.spinnerService.hide()
              this.mform.patchValue(
                {
                  code: resp.code
                }
              )
            }
            else {
              return this.router.navigate([`/login`])
            }
          },
          (err) => {
            if (err.error.error) {
              return this.router.navigate(['/login'])
            }
          }
        )
      },
      (err) => {
        this.router.navigate(['/login'])
      }
    )
  }

  /**
   * @see form_validation
   */
  creatForm() {
    this.mform = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirm_password: ['', [Validators.required, Validators.minLength(4)]],
        code: [null, Validators.required]
      }
    )
  }
 
  /**
   * @see set_password
   * set password for invited vendor
   */
  setPassword() {
    this.spinnerService.show()
    let o: SetPassword = {
      password: this.mform.value.password,
      confirm_password: this.mform.value.confirm_password,
      activation_code: this.mform.value.code
    }
    this.accountService.query(o).subscribe((res) => {
      if (res) {
        this.hasError = false;
        this.spinnerService.hide();
        return this.router.navigate(['register'], { queryParams: { code: this.mform.value.code } })
      }
    }, (err) => {
      this.spinnerService.hide();
      this.hasError = true;
      this.translateResponseMessage(err);
    })
  }

  /**
    * translate the response message to user
    */
  translateResponseMessage(err): void {
    this.translateService.get([
      AccountLocalConstant.GEN_0002,
      AccountLocalConstant.GEN_0003,
      AccountLocalConstant.GEN_0004,
      AccountLocalConstant.GEN_0005,
      AccountLocalConstant.GEN_0006,
      AccountLocalConstant.GEN_0009
    ]).subscribe(
      (error_message) => {
        if (err.error.error === 'GEN_0002') {
          console.log('Minimum length of 8');
          return this.showResponseMessage(error_message[AccountLocalConstant.GEN_0002])
        } else if (err.error.error === 'GEN_0003') {
          // console.log('common password');
          return this.showResponseMessage(error_message[AccountLocalConstant.GEN_0003])
        } else if (err.error.error === 'GEN_0004') {
          // console.log('Not similar with the username');
          return this.showResponseMessage(error_message[AccountLocalConstant.GEN_0004])
        } else if (err.error.error === 'GEN_0005') {
          // console.log('Combination of alphanumeric and special char (spaces not allowed)');
          return this.showResponseMessage(error_message[AccountLocalConstant.GEN_0005])
        } else if (err.error.error === 'GEN_0006') {
          // link expired
          return this.router.navigate(['/login']);
        }
        else if (err.error.error === 'GEN_0009') {
          // password dose not matched
          return this.showResponseMessage(error_message[AccountLocalConstant.GEN_0009])
        }
        else {
          console.log(err.error.error);
          return this.showResponseMessage('An Error has occured try again');
        }
      }
    )
  }
  /**
   * @param message 
   * @see display the response message for user
   */
  showResponseMessage(message: string): string {
    this.hasError = true;
    return this.message = message
  }

}
