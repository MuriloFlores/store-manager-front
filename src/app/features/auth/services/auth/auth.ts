import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {
  CreateUserRequest,
  DecodedToken,
  LoginRequest,
  LoginResponse, ResendVerificationRequest,
  UserResponse
} from '../../../../core/models/user.model';

interface AppClaims {
  user_id: string;
  name: string;
  role: 'admin' | 'manager' | 'salesperson' | 'client' | 'stock_person' | 'cashier';
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'https://muriloflores.xyz';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
      }),
      catchError((err) => this.handleError(err))
    );
  }

  register(userData: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}/create-user`, userData).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/auth/login']);
  }

  confirmAccount(token: string): Observable<{ message: string }> {
    const params = new HttpParams().set('token', token);
    return this.http.get<{ message: string }>(`${this.API_URL}/verify-account`, { params });
  }

  resendVerificationEmail(email: string): Observable<void> {
    const payload: ResendVerificationRequest = { email };
    return this.http.post<void>(`${this.API_URL}/auth/resend-verification`, payload).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  public getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  public isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  public getCurrentUser(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: AppClaims = jwtDecode(token);
      const isExpired = Date.now() >= decoded.exp * 1000;

      if (isExpired) {
        localStorage.removeItem('auth_token');
        return null;
      }

      return {
        id: decoded.user_id,
        name: decoded.name,
        role: decoded.role,
        exp: decoded.exp
      };
    } catch (error) {
      localStorage.removeItem('auth_token');
      return null;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocorreu um erro na API!', error.error);

    const causes = error.error?.causes;
    if (error.status === 403 && Array.isArray(causes) && causes.length > 0 && causes[0].message === 'EMAIL_NOT_VERIFIED') {
      return throwError(() => new Error('EMAIL_NOT_VERIFIED'));
    }

    if (error.status === 429 && error.error?.error === 'rate_limit_exceeded') {
      return throwError(() => new Error(error.error.message || 'Muitas tentativas. Tente mais tarde.'));
    }

    let userMessage = error.error?.message || 'Ocorreu um erro inesperado.';
    if (error.status === 401) {
      userMessage = 'E-mail ou senha inválidos.';
    }

    return throwError(() => new Error(userMessage));
  }
}
