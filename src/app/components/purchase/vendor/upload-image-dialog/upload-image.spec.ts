import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadVendorImageComponent } from './upload-image';

describe('UploadVendorImageComponent', () => {
  let component: UploadVendorImageComponent;
  let fixture: ComponentFixture<UploadVendorImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadVendorImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadVendorImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
