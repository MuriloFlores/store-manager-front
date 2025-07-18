import { Component, inject, ViewChild, NgZone } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from '../../components/register-form/register-form';
import {AuthService} from '../../services/auth/auth';
import {NotificationService} from '../../../../shared/services/notification';
import {CreateUserRequest} from '../../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RegisterFormComponent, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})

export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private zone = inject(NgZone);

  @ViewChild(RegisterFormComponent) private registerFormComponent!: RegisterFormComponent;

  public isRegistering = false;

  onRegister(userData: CreateUserRequest): void {
    if (this.isRegistering) return;
    this.isRegistering = true;

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isRegistering = false;
        this.notificationService.show('Conta criada! Verifique seu e-mail para o código.', 'success');
        this.zone.run(() => {
          this.router.navigate(['/auth/verify-otp'], { queryParams: { email: userData.email } });
        });
      },
      error: (err) => {
        this.isRegistering = false;
        this.notificationService.show(err.message, 'error');
        this.registerFormComponent.resetPasswordFields();
      }
    });
  }
}
