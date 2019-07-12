import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInviteDialogComponent } from './vendor-invite-dialog.component';

describe('VendorInviteDialogComponent', () => {
  let component: VendorInviteDialogComponent;
  let fixture: ComponentFixture<VendorInviteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorInviteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorInviteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
