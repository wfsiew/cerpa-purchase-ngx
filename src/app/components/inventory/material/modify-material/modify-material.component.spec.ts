import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMaterialComponent } from './modify-material.component';

describe('ModifyMaterialComponent', () => {
  let component: ModifyMaterialComponent;
  let fixture: ComponentFixture<ModifyMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
