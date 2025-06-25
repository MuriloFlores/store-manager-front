import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaginatedResponse} from '../../../core/models/pagination.models';
import {UserResponse} from '../../../core/models/user.model';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private http = inject(HttpClient)
  private readonly API_URL = 'https://muriloflores.xyz/api'

  getUsers(page: number, pageSize: number): Observable<PaginatedResponse<UserResponse>> {
    console.log(`[SERVICE] getUsers chamado com: page=${page}, pageSize=${pageSize}`);

    if (page === undefined || pageSize === undefined || page === null || pageSize === null) {
      console.error('[SERVICE] ERRO FATAL: Parâmetro de paginação recebido como undefined/null!');
      return throwError(() => new Error('Parâmetro de paginação inválido.'));
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResponse<UserResponse>>(`${this.API_URL}/users`, { params });
  }

  deleteUser(userID: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/user/${userID}`)
  }

  updateUserRole(userID: string, newRole: string): Observable<UserResponse> {
    const payload = {role: newRole}

    return this.http.put<UserResponse>(`${this.API_URL}/user/${userID}`, payload)
  }
}
