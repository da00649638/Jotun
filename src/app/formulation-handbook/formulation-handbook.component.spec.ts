import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulationHandbookComponent } from './formulation-handbook.component';

describe('FormulationHandbookComponent', () => {
  let component: FormulationHandbookComponent;
  let fixture: ComponentFixture<FormulationHandbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulationHandbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulationHandbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
