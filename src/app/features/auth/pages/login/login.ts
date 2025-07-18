import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth';
import {Router, RouterLink} from '@angular/router';
import {NotificationService} from '../../../../shared/services/notification';
import {LoginRequest} from '../../../../core/models/user.model';
import {LoginFormComponent} from '../../components/login-form/login-form';

@Component({
  selector: 'app-login',
  imports: [
    LoginFormComponent,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService)
  private router = inject(Router)
  private notificationService = inject(NotificationService)

  ngOnInit() {
    this.notificationService.displayFlashMessage()
  }

  onLogin(credentials: LoginRequest): void {
    this.authService.login(credentials).subscribe({
      next: () => {
        this.notificationService.show("Login realizado com sucesso", "success");
        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        if (err.message === 'EMAIL_NOT_VERIFIED') {
          this.notificationService.show('Sua conta precisa ser verificada.', 'info');
          this.router.navigate(['/auth/resend-verification'], {
            queryParams: { email: credentials.email }
          });
        } else {
          this.notificationService.show(err.message, 'error');
        }
      }
    })
  }
}
