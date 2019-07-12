import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuardService } from '../../../account/services/auth-guard.service';
import { AuthService } from '../../../account/services/auth.service';
import { LogoutComponent } from '../logout';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AccountService } from '../service';
import { AppConstant } from '../../../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.css']
})
export class UpdateUserProfileComponent implements OnInit, OnDestroy {
  userDetails:any;
  @ViewChild(ChangePasswordComponent) cardChangePassword : ChangePasswordComponent;
  @ViewChild(LogoutComponent)logoutUser: LogoutComponent;
  @Input() showApp: string = '';

  formgroup:FormGroup;
  hasError:boolean = false;
  current_img:string = 'assets/images/default-m-icon/default-m-icon.png';
  public logo: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authGuardService: AuthGuardService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<UpdateUserProfileComponent>,
    private spinnerService: Ng4LoadingSpinnerService,
    private accountService: AccountService
  ) {}
  
  ngOnInit() {     
  this.createForm();
  this.getUserDetails();
  }
 
  createForm(){
    this.formgroup = this.fb.group({
      fName: ['',[Validators.required]],
      lName: ['',[Validators.required]]
    })
  }

  getUserDetails(){
    this.spinnerService.show();
    this.accountService.queryGetUserDetails().subscribe((res:any)=>{
      if (res) {
        this.patchUserInfo(res);
        this.userDetails = res
      }
  },(err)=>{
    this.onError(err);
  })
}

patchUserInfo(info){
  this.spinnerService.hide()
  this.formgroup.patchValue({
    fName: info.first_name,
    lName: info.last_name
   })
   if (info.picture != null) {
    this.current_img = info.picture;
   }
}
  uploadUserP(files: FileList) {
    this.hasError = false;
    this.spinnerService.show();
    if (files.length > 0) {
      this.logo = files.item(0);
      this.accountService.upLoadUserProfileImg(this.logo).subscribe(
        (res) => {
          this.spinnerService.hide()
          if (res) { 
            setTimeout(() => {
              this.dialogRef.close(true);
            }, 100);
          }
        },
        (err) => {
          this.spinnerService.hide()
          this.hasError = true;
        })
    }else{
      this.hasError = true;
      this.spinnerService.hide()
    }
  }


  updateInfo(value){
    this.spinnerService.show();
    var body = {
      first_name: value.fName,
      last_name:value.lName
    }
    this.accountService.updateInfo(body).subscribe((res)=>{
      this.spinnerService.hide();
      this.hasError= false;
      this.dialogRef.close(true);
    },(err)=>{
      this.onError(err)
    })
  }

  onError(err){
    this.hasError = true;
    this.spinnerService.hide();
  }

  ngOnDestroy(){
    if (this.formgroup.touched) {
      console.log('are sure! you don\'t want to save the changes?')
    }
  }
}
