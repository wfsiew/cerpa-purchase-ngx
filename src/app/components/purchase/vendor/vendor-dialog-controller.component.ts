import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { VendorInviteDialogComponent } from './vendor-invite-dialog.component';

@Component({
  selector: 'app-vendor-dialog-controller',
  template: ''
})
export class VendorDialogControllerComponent implements OnInit, OnDestroy {

  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      const path: string = this.route.snapshot.url[0].path;
      if (path === 'vendor-invite') {
        this.openInviteDialog();
      }
    });
  }

  openInviteDialog() {
    setTimeout(() => {
      const dialogRef = this.dialog.open(VendorInviteDialogComponent, {
        width: '400px',
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
      });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}