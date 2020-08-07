import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormulationProductComponent } from './add-formulation-product.component';

describe('AddFormulationProductComponent', () => {
  let component: AddFormulationProductComponent;
  let fixture: ComponentFixture<AddFormulationProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFormulationProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFormulationProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
