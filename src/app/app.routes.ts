import { Routes } from '@angular/router';
import {AuthLayoutComponent} from './core/layouts/auth-layout/auth-layout';
import {MainLayout} from './core/layouts/main-layout/main-layout';
import {authGuard} from './core/guards/auth-guard';
import {adminManagerGuard} from './core/guards/admin-manager-guard';
import {inventoryStaffGuard} from './core/guards/inventory-staff-guard';
import {smartRedirectGuard} from './core/guards/smart-redirect-guard';
import {PageNotFound} from './core/components/page-not-found/page-not-found';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES) }
    ]
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'products',
        loadChildren: () => import('./features/products/products.router').then(r => r.PRODUCT_ROUTES)
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(r => r.DASHBOARD_ROUTES)
      },
      {
        path: 'management',
        canActivate: [authGuard, adminManagerGuard],
        loadChildren: () => import('./features/management/management.routes').then(r => r.MANAGEMENT_ROUTES)
      },
      {
        path: 'inventory',
        canActivate: [authGuard, inventoryStaffGuard],
        loadChildren: () => import('./features/inventory/inventory.routes').then(r => r.INVENTORY_ROUTES)
      },
      {
        path: '',
        redirectTo: 'products',
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
