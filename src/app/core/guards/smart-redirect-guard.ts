import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from '../../features/auth/services/auth/auth';

export const smartRedirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    console.log('Rota inválida, usuário logado. Redirecionando para /dashboard...');
    router.navigate(['/dashboard']);
  } else {

    console.log('Rota inválida, usuário deslogado. Redirecionando para /auth/login...');
    router.navigate(['/auth/login']);
  }

  return false;
};
