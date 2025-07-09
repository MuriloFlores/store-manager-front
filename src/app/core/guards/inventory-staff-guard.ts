import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../../features/auth/services/auth/auth';
import { inject } from '@angular/core';
import {NotificationService} from '../../shared/services/notification';

export const inventoryStaffGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const currentUser = authService.getCurrentUser();

  const allowedRoles = ['admin', 'manager', 'stock_person'];

  if (currentUser && allowedRoles.includes(currentUser.role)) {
    return true;
  }

  notificationService.show('Você não tem permissão para acessar esta área.', 'error');
  router.navigate(['/dashboard']);

  return false;
};
