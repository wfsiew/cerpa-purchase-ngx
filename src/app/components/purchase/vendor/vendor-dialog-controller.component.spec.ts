import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDialogControllerComponent } from './vendor-dialog-controller.component';

describe('VendorDialogControllerComponent', () => {
  let component: VendorDialogControllerComponent;
  let fixture: ComponentFixture<VendorDialogControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorDialogControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorDialogControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
