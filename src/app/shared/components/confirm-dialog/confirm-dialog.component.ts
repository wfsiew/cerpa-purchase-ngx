import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  id?: any;
  content: string;
  button_yes: string;
  button_no: string;
  title: string;

  constructor( private dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) data) 
    {
      this.id = data.id;
      this.content = data.message;
      this.title = data.title;
      this.button_yes = data.button_yes;
      this.button_no = data.button_no;
    }

  ngOnInit() {}

  submit() {
    this.dialogRef.close({ id: this.id });
  }
}
