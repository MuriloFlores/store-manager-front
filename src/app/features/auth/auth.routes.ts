import {Routes} from '@angular/router';
import {RegisterComponent} from './pages/register/register';
import {LoginComponent} from './pages/login/login';

export const AUTH_ROUTES: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Crie Sua Conta'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
]
