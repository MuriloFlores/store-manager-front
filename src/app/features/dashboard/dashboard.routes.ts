import { Routes } from '@angular/router';
import {authGuard} from '../../core/guards/auth-guard';
import {MainDashboardComponent} from './pages/main-dashboard/main-dashboard';


export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: MainDashboardComponent,
    canActivate: [authGuard],
    title: 'Dashboard'
  }
];
