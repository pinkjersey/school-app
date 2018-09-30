import { TestBed } from '@angular/core/testing';

import { LrsService } from './lrs.service';

describe('LrsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LrsService = TestBed.get(LrsService);
    expect(service).toBeTruthy();
  });
});
