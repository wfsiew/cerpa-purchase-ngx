import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-complete-dialog',
  templateUrl: './confirm-complete-dialog.component.html',
  styleUrls: ['./confirm-complete-dialog.component.css']
})
export class ConfirmCompleteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<ConfirmCompleteDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

}
