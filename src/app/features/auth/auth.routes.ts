import {Routes} from '@angular/router';
import {RegisterComponent} from './pages/register/register';

export const AUTH_ROUTES: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Crie Sua Conta'
  },
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  }
]
