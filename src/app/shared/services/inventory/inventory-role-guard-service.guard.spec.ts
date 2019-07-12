import { TestBed, async, inject } from '@angular/core/testing';

import { InventoryRoleGuardServiceGuard } from './inventory-role-guard-service.guard';

describe('InventoryRoleGuardServiceGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InventoryRoleGuardServiceGuard]
    });
  });

  it('should ...', inject([InventoryRoleGuardServiceGuard], (guard: InventoryRoleGuardServiceGuard) => {
    expect(guard).toBeTruthy();
  }));
});
