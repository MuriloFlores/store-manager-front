import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { CreateUserRequest } from '../../../../core/models/user.model';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css'

})


export class RegisterForm {
  @Output() formSubmit = new EventEmitter<CreateUserRequest>();

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
    })
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return {passwordMismatch: true};
    }

    return null;
  }

  get name(): AbstractControl | null {
    return this.registerForm.get('name');
  }

  get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.registerForm.get('confirmPassword');
  }

  onSubmit(): void {
    this.registerForm.markAllAsTouched()

    if (this.registerForm.invalid) {
      return;
    }

    this.formSubmit.emit(this.registerForm.value)
  }
}
