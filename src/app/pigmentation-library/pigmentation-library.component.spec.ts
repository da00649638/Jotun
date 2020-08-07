import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PigmentationLibraryComponent } from './pigmentation-library.component';

describe('PigmentationLibraryComponent', () => {
  let component: PigmentationLibraryComponent;
  let fixture: ComponentFixture<PigmentationLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigmentationLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigmentationLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
