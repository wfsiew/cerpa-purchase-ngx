import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaisePoDialogComponent } from './raise-po-dialog.component';

describe('RaisePoDialogComponent', () => {
  let component: RaisePoDialogComponent;
  let fixture: ComponentFixture<RaisePoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaisePoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaisePoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
