import {Component, inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {
  AppClaims,
  CreateUserRequest,
  DecodedToken,
  LoginRequest,
  LoginResponse,
  UserResponse
} from '../../../../core/models/user.model';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router);
  private readonly API_URL = 'https://muriloflores.xyz'

  private getDecodedUser(): DecodedToken | null {
    const token = localStorage.getItem('auth_token');

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
        role: decoded.role,
        exp: decoded.exp,
        name: decoded.name
      }
    } catch (error) {
      console.log("token invalido: ", error);
      localStorage.removeItem('auth_token');

      return null;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocorreu um erro na API!', error);
    let userMessage = 'Não foi possível completar o seu cadastro. Tente novamente mais tarde.';

    if (error.error?.message?.includes('email already exists')) {
      userMessage = 'Este e-mail já está em uso.';
    }

    return throwError(() => new Error(userMessage));
  }

  public register(userData: CreateUserRequest): Observable<UserResponse> {
    const {password, ...rest} = userData;
    const apiRequest: CreateUserRequest = {password, ...rest};

    return this.http.post<UserResponse>(`${this.API_URL}/create-user`, apiRequest).pipe(
      catchError(this.handleError)
    );
  }

  public login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
      }),
      catchError(this.handleError)
    );
  }

  public logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/auth/login']);
  }

  public getCurrentUser(): DecodedToken | null {
    return this.getDecodedUser();
  }

  public isLoggedIn(): boolean {
    return !!this.getDecodedUser()
  }

  public getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  public confirmAccount(token: string): Observable<{ message: string }> {
    const params = new HttpParams().set('token', token)

    return this.http.get<{message: string}>(`${this.API_URL}/verify-account`, { params })
  }
}
