import { TestBed } from '@angular/core/testing';

import { BtcService } from './btc.service';

describe('BtcService', () => {
  let service: BtcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BtcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
