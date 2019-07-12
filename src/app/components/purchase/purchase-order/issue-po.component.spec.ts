import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuePurchaseOrderComponent } from './issue-po.component';

describe('IssuePurchaseOrderComponent', () => {
  let component: IssuePurchaseOrderComponent;
  let fixture: ComponentFixture<IssuePurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuePurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuePurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
