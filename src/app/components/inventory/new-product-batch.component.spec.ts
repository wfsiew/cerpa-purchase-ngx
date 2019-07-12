import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductBatchComponent } from './new-product-batch.component';

describe('NewProductBatchComponent', () => {
  let component: NewProductBatchComponent;
  let fixture: ComponentFixture<NewProductBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProductBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProductBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
