import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchaseRequestComponent } from './view-pr.component';

describe('PurchaseRequest', () => {
  let component: ViewPurchaseRequestComponent;
  let fixture: ComponentFixture<ViewPurchaseRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPurchaseRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPurchaseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
