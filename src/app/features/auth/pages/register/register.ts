import {Component, inject, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterForm} from '../../components/register-form/register-form';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth';
import {NotificationService} from '../../../../shared/services/notification';
import {CreateUserRequest} from '../../../../core/models/user.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RegisterForm, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  @ViewChild(RegisterForm) private registerForm!: RegisterForm;

  onRegister(userData: CreateUserRequest): void {
    console.log("dados recebidos: " + userData);
    this.authService.register(userData).subscribe({
      next: (response) => {
       this.notificationService.showOnNextRouter(`Usuário ${response.name} criado com sucesso!`, 'success')

       this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.registerForm.resetPasswordFields()
        this.notificationService.show(error.message, "error")
      }
    })
  }
}
