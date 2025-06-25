import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {NotificationService} from '../../shared/services/notification';
import {AuthService} from '../../features/auth/services/auth/auth';


export const adminManagerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const currentUser = authService.getCurrentUser();

  if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager')) {
    return true;
  } else {
    notificationService.show('Você não tem permissão para acessar esta página.', 'error');

    router.navigate(['/dashboard']);
    return false;
  }
};
