import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AccountService } from '../service';
import { AppConstant } from '../../../shared';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }


  changePassBtn:boolean = false;
  isSuccess:boolean = false;
  hasError:boolean = false;
  fGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data:ChangePasswordComponent,
    private accountService: AccountService,
    private fb: FormBuilder,
  ) {
    this.changePassBtn = true;
  }

  ngOnInit() {
    this.createForm();
    this.cardStatus = 'close';
    this.changePasswordStatus = '';
  }

  changePasswordStatus: String = '';
  cardStatus: String = 'close';

  closeChangePasswordCard() {
    this.cardStatus = 'close';
  }

  createForm(){
    this.fGroup = this.fb.group(
      {
        current_password:[null,[Validators.required, Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.PASSWORD_VALIDATION)]],
        new_password:[null,[Validators.required, Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.PASSWORD_VALIDATION)]],
        confirm_new_password:[null,[Validators.required, Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.PASSWORD_VALIDATION)]]
      }, {validator: passwordMatch}
    )
  }

  changePassword(v){
    this.hasError= false;
    this.accountService.queryChangePassword(v).subscribe(
      (res)=>{
        this.isSuccess = true;
      },(error)=>{
        this.onError(error);
      })
  }

  closeDailog(){
    this.dialogRef.close({close:true})
  }
 
  onError(error){
    this.hasError = true;
    this.isSuccess = false;
    console.log(error);
  }
}

export function passwordMatch
  (control: AbstractControl): { [key: string]: boolean } {
  const pwd = control.get('new_password');
  const confirmPwd = control.get('confirm_new_password');
    if (pwd.value === confirmPwd.value) {
      return null;
    }
  return { mismatch: null};
}