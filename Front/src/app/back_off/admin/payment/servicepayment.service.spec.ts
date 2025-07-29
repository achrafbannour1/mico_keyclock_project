import { TestBed } from '@angular/core/testing';

import { ServicepaymentService } from './servicepayment.service';

describe('ServicepaymentService', () => {
  let service: ServicepaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicepaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
