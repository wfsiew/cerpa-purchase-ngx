import { Component, OnInit, Inject } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccountService } from '../../../account/service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.html',
  styleUrls: ['./upload-image.css']
})
export class UploadVendorImageComponent implements OnInit {
  formgroup: FormGroup;
  public logo: any;
  error_message = false;
  success_message = false;
  spinner = false;
  company_logo = 'assets/images/default-image-icon/default-image-icon.png';
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UploadVendorImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileDialogData,
  ) {
    this.logo = [];
  }
  ngOnInit() {}

  handleFileInput(files: FileList) {
    this.success_message = false;
    this.error_message = false;
    this.spinner = true;
    if (files.length > 0) {
      this.logo = files.item(0);
      this.accountService.queryUploadImage(Number(this.data.id),this.logo).subscribe(
        (res) => {
          if (res) {
            this.success_message = true;
            this.spinner = false;
            setTimeout(() => {
              this.dialogRef.close();
            }, 500);
          }
        },
        (err) => {
          this.spinner = true;
          this.error_message = true;
        })
    }else{
      console.log('somethings went wrong ...');
      this.error_message = true;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
export interface FileDialogData {
  id: string;
  file: any;
}
