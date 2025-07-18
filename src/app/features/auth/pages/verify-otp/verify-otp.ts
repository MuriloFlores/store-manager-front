import {Component, inject, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth';
import {NotificationService} from '../../../../shared/services/notification';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';

@Component({
  selector: 'app-verify-otp',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css'
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private authService = inject(AuthService)
  private notificationService = inject(NotificationService)
  private fb = inject(FormBuilder)

  public otpForm!: FormGroup;
  public email: string | null = null;
  public isLoading = false;

  public isResendDisabled = false;
  public countdown = 0;
  private timerInterval: any;

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email');

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    })
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }
  }

  get otp() {
    return this.otpForm.get('otp')
  }

  onSubmit() {
    if (this.otpForm.invalid || !this.otp) {
      return;
    }

    this.isLoading = true;
    const otpCode = this.otp.value;

    this.authService.confirmAccount(otpCode).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notificationService.show(response.message, "success");

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500)
      },

      error: (error) => {
        this.isLoading = false;
        this.notificationService.show('Código inválido ou expirado. Tente novamente.', "error");
        this.otp?.reset();
      }
    })
  }

  onResend(): void {
    if (!this.email || this.isResendDisabled) return;

    this.isLoading = true;

    this.authService.resendVerificationEmail(this.email).subscribe({
      next: () => {
        this.notificationService.show(`E-mail de verificação reenviado para ${this.email}.`, 'success');
        this.isLoading = false;
        this.startCooldownTimer();
      },
      error: (err) => {
        this.notificationService.show(err.message, 'error');
        this.isLoading = false;
      }
    });
  }

  private startCooldownTimer(): void {
    this.isResendDisabled = true;
    this.countdown = 300;

    this.timerInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timerInterval);
        this.isResendDisabled = false;
      }
    }, 1000);
  }
}
