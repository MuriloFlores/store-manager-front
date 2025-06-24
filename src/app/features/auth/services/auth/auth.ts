import {Component, inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CreateUserRequest, UserResponse} from '../../../../core/models/user.model';
import {catchError, Observable, throwError} from 'rxjs';

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

  private readonly API_URL = 'https://muriloflores.xyz'

  register(userData: CreateUserRequest): Observable<UserResponse> {
    const {password, ...rest} = userData;
    const apiRequest: CreateUserRequest = {password, ...rest};

    return this.http.post<UserResponse>(`${this.API_URL}/create-user`, apiRequest).pipe(
      catchError(this.handleError)
    );
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
