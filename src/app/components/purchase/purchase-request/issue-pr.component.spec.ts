import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuePurchaseRequestComponent } from './issue-pr.component';

describe('PurchaseRequest', () => {
  let component: IssuePurchaseRequestComponent;
  let fixture: ComponentFixture<IssuePurchaseRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuePurchaseRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuePurchaseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
