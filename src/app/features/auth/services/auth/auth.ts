import {Component, inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CreateUserRequest, LoginRequest, LoginResponse, UserResponse} from '../../../../core/models/user.model';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router);

  private readonly API_URL = 'https://muriloflores.xyz'

  register(userData: CreateUserRequest): Observable<UserResponse> {
    const {password, ...rest} = userData;
    const apiRequest: CreateUserRequest = {password, ...rest};

    return this.http.post<UserResponse>(`${this.API_URL}/create-user`, apiRequest).pipe(
      catchError(this.handleError)
    );
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/auth/login']);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocorreu um erro na API!', error);
    let userMessage = 'Não foi possível completar o seu cadastro. Tente novamente mais tarde.';

    if (error.error?.message?.includes('email already exists')) {
      userMessage = 'Este e-mail já está em uso.';
    }

    return throwError(() => new Error(userMessage));
  }
}
