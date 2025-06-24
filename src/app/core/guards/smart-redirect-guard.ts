import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const smartRedirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  if (token) {
    console.log('Rota inválida, usuário logado. Redirecionando para /dashboard...');
    router.navigate(['/dashboard']);
  } else {

    console.log('Rota inválida, usuário deslogado. Redirecionando para /auth/login...');
    router.navigate(['/auth/login']);
  }

  return false;
};
