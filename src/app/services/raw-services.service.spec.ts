import { TestBed } from '@angular/core/testing';

import { RawServicesService } from './raw-services.service';

describe('RawServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RawServicesService = TestBed.get(RawServicesService);
    expect(service).toBeTruthy();
  });
});
