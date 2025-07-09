import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { inventoryStaffGuard } from './inventory-staff-guard';

describe('inventoryStaffGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => inventoryStaffGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
