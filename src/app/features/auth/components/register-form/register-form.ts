import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {CreateUserRequest} from '../../../../core/models/user.model';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css']
})

export class RegisterFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<CreateUserRequest>();
  @Input() isRegistering = false;

  private fb = inject(FormBuilder);
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.registerForm.value);
  }

  private passwordMatchValidator(c: AbstractControl): ValidationErrors | null {
    return c.get('password')?.value === c.get('confirmPassword')?.value ? null : { passwordsMismatch: true };
  }

  public resetPasswordFields(): void {
    this.registerForm.get('password')?.reset();
    this.registerForm.get('confirmPassword')?.reset();
  }

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}
