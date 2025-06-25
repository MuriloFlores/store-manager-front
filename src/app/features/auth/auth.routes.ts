import {Routes} from '@angular/router';
import {RegisterComponent} from './pages/register/register';
import {LoginComponent} from './pages/login/login';
import {VerifyAccount} from './pages/verify-account/verify-account';

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
    path: 'verify-account',
    component: VerifyAccount,
    title: 'Verificação de Conta',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
]
