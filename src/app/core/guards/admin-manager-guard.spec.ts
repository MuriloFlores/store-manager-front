import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminManagerGuard } from './admin-manager-guard';

describe('adminManagerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminManagerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
