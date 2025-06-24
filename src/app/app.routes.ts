import { Routes } from '@angular/router';
import {smartRedirectGuard} from './core/guards/smart-redirect-guard';
import {PageNotFound} from './core/components/page-not-found/page-not-found';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(r => r.DASHBOARD_ROUTES)
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {

    path: '**',
    canActivate: [smartRedirectGuard],
    component: PageNotFound
  }
];
