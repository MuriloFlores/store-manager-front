import {Routes} from '@angular/router';
import {RegisterComponent} from './pages/register/register';
import {LoginComponent} from './pages/login/login';
import {ResendVerification} from './pages/resend-verification/resend-verification';
import {VerifyOtpComponent} from './pages/verify-otp/verify-otp';

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
    path: 'verify-otp',
    component: VerifyOtpComponent,
    title: 'Verificação de Conta',
  },
  {
    path: 'resend-verification',
    component: ResendVerification,
    title: 'Reenviar Verificação',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
]
