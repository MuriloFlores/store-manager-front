import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth';

@Component({
  selector: 'app-verify-account',
  imports: [
    RouterLink
  ],
  templateUrl: './verify-account.html',
  styleUrl: './verify-account.css'
})
export class VerifyAccount implements OnInit {
  private route = inject(ActivatedRoute)
  private authService = inject(AuthService);

  public verificationStatus: 'loading' | 'success' | 'error' = 'loading';
  public message: string = '';

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.verificationStatus = 'error';
      this.message = 'Token de verificação não encontrado. Por favor, verifique o link no seu e-mail.';
      return;
    }

    this.authService.confirmAccount(token).subscribe({
      next: (response) => {
        this.verificationStatus = 'success';
        this.message = response.message;
      },
      error: (error) => {
        this.verificationStatus = 'error';
        this.message = 'Ocorreu um erro ao verificar sua conta. O token pode ser inválido ou ter expirado.'
      }
    })
  }
}
