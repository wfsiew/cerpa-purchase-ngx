import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmCompleteDialogComponent } from '../components/confirm-complete-dialog/confirm-complete-dialog.component';

@Injectable()
export class ConfirmDialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(msg) {
    return this.dialog.open(ConfirmCompleteDialogComponent,{
      width: '400px',
      disableClose: true,
      data: {
        message: msg
      }
    });

  }
}
