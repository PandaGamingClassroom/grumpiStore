import { TestBed } from '@angular/core/testing';

import { GrumpiService } from './grumpi.service';

describe('GrumpiService', () => {
  let service: GrumpiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrumpiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
