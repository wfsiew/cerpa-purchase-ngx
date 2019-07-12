import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStockComponent } from './material-stock.component';

describe('MaterialStockComponent', () => {
  let component: MaterialStockComponent;
  let fixture: ComponentFixture<MaterialStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
