import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {LoginRequest} from '../../../../core/models/user.model';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginFormComponent implements OnInit  {
  @Output() formSubmit = new EventEmitter<LoginRequest>();

  private fb = inject(FormBuilder);
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAsTouched();
      return;
    }

    this.formSubmit.emit(this.loginForm.value);
  }
}
