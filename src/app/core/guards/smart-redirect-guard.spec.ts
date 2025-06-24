import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { smartRedirectGuard } from './smart-redirect-guard';

describe('smartRedirectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => smartRedirectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
