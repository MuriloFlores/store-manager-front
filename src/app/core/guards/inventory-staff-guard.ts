import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../../features/auth/services/auth/auth';
import { inject } from '@angular/core';
import {NotificationService} from '../../shared/services/notification';

export const inventoryStaffGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  console.log('%c[Guard: InventoryStaff] Guarda de rota executando...', 'color: orange; font-weight: bold;');

  const currentUser = authService.getCurrentUser();
  console.log('[Guard: InventoryStaff] Objeto "currentUser" retornado pelo serviço:', currentUser);

  const allowedRoles = ['admin', 'manager', 'stock_person'];

  const userRole = currentUser?.role;
  console.log(`[Guard: InventoryStaff] Cargo a ser verificado: "${userRole}" (Tipo: ${typeof userRole})`);

  const hasPermission = currentUser && allowedRoles.includes(userRole!);
  console.log(`[Guard: InventoryStaff] A verificação 'allowedRoles.includes("${userRole}")' resultou em: ${hasPermission}`);

  if (hasPermission) {
    console.log('%c[Guard: InventoryStaff] Acesso PERMITIDO.', 'color: green; font-weight: bold;');
    return true;
  }

  console.log('%c[Guard: InventoryStaff] Acesso NEGADO. Redirecionando...', 'color: red; font-weight: bold;');
  notificationService.show('Você não tem permissão para acessar esta área.', 'error');
  router.navigate(['/dashboard']);
  return false;
};
