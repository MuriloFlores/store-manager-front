import {Routes} from '@angular/router';
import {smartRedirectGuard} from './core/guards/smart-redirect-guard';
import {PageNotFound} from './core/components/page-not-found/page-not-found';
import {AuthLayout} from './core/layouts/auth-layout/auth-layout';
import {MainLayout} from './core/layouts/main-layout/main-layout';
import {authGuard} from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES)
      }
    ],
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(r => r.DASHBOARD_ROUTES)
      },
      {
        path: 'management',
        loadChildren: () => import('./features/management/management.routes').then(r => r.MANAGEMENT_ROUTES)
      },
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    canActivate: [smartRedirectGuard],
    component: PageNotFound
  }
];
