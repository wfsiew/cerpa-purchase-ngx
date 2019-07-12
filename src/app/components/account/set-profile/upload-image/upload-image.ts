import { Component, OnInit, Inject } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccountService } from '../../service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.html',
  styleUrls: ['./upload-image.css']
})
export class UploadImageComponent implements OnInit {
  formgroup: FormGroup;
  public logo: any;
  hasError = false;
  errorMessage = "upload failed"
  success_message = false;
  company_logo = 'assets/images/default-image-icon/default-image-icon.png';
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    public dialogRef: MatDialogRef<UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileDialogData,
  ) {
    this.logo = [];
  }
  ngOnInit() {}

  handleFileInput(files: FileList) {
    this.success_message = false;
    this.hasError = false;
    this.spinnerService.show();
    if (files.length > 0) {
      this.logo = files.item(0);
      this.accountService.queryUploadImage(Number(this.data.id),this.logo).subscribe(
        (res) => {
          this.spinnerService.hide()
          if (res) { 
            this.success_message = true;
            setTimeout(() => {
              this.dialogRef.close(true);
            }, 500);
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
  onNoClick(): void {
    this.dialogRef.close(false);
  } 
}
export interface FileDialogData {
  id: string;
  file: any;
}
