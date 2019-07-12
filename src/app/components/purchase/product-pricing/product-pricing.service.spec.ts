import { TestBed, inject } from '@angular/core/testing';

import { ProductPricingService } from './product-pricing.service';

describe('ProductPricingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductPricingService]
    });
  });

  it('should be created', inject([ProductPricingService], (service: ProductPricingService) => {
    expect(service).toBeTruthy();
  }));
});
