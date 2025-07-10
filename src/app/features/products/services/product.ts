import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaginatedResponse} from '../../../core/models/pagination.models';
import {
  ClientItemResponse,
  CreateItemRequest,
  InternalItemResponse,
  UpdateItemRequest
} from '../../../core/models/item.model';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private http = inject(HttpClient);
  private readonly PUBLIC_URL = 'https://muriloflores.xyz/';
  private readonly API_URL = 'https://muriloflores.xyz/api';

  getPublicProducts(page: number, pageSize: number): Observable<PaginatedResponse<ClientItemResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResponse<ClientItemResponse>>(`${this.PUBLIC_URL}/items`, {params})
  }

  searchProducts(term: string, page: number, pageSize: number): Observable<PaginatedResponse<ClientItemResponse | InternalItemResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResponse<ClientItemResponse | InternalItemResponse>>(`${this.PUBLIC_URL}/items/search/${term}`, {params});
  }

  getInternalProducts(page: number, pageSize: number): Observable<PaginatedResponse<InternalItemResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResponse<InternalItemResponse>>(`${this.API_URL}/items`, { params });
  }

  createProduct(payload: CreateItemRequest): Observable<InternalItemResponse> {
    return this.http.post<InternalItemResponse>(`${this.API_URL}/item`, payload);
  }

  updateProduct(id: string, payload: UpdateItemRequest): Observable<InternalItemResponse> {
    return this.http.patch<InternalItemResponse>(`${this.API_URL}/item/${id}`, payload);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/item/${id}`);
  }

  reactivateProduct(id: string): Observable<InternalItemResponse> {
    return this.http.post<InternalItemResponse>(`${this.API_URL}/items/${id}/reactivate`, {})
  }
}

