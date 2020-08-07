import { TestBed } from '@angular/core/testing';

import { AddProductFormulationService } from './add-product-formulation.service';

describe('AddProductFormulationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddProductFormulationService = TestBed.get(AddProductFormulationService);
    expect(service).toBeTruthy();
  });
});
