import { Routes } from '@angular/router';
import {UserListComponent} from './pages/user-list/user-list';
import {adminManagerGuard} from '../../core/guards/admin-manager-guard';

export const MANAGEMENT_ROUTES: Routes = [
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [adminManagerGuard],
    title: 'Gerenciar Usuários'
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];
