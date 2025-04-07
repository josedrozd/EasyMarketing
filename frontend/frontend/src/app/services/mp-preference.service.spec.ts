import { TestBed } from '@angular/core/testing';

import { MpPreferenceService } from './mp-preference.service';

describe('MpPreferenceService', () => {
  let service: MpPreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MpPreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
