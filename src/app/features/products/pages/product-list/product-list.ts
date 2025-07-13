import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { PaginationInfo, PaginatedResponse } from '../../../../core/models/pagination.models';
import {ProductService} from '../../services/product';
import {ClientItemResponse, InternalItemResponse} from '../../../../core/models/item.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    ReactiveFormsModule
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  public products: (ClientItemResponse | InternalItemResponse)[] = [];
  public paginationInfo: PaginationInfo | null = null;
  public isLoading = true;
  public searchForm!: FormGroup;
  private currentSearchTerm = '';

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      term: ['']
    });

    this.fetchData(1, '');

    this.searchForm.get('term')?.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(term => {
        this.isLoading = true;
        this.currentSearchTerm = term;
      }),
      switchMap(term => this.fetchDataObservable(1, term))
    ).subscribe({
      next: (response) => this.handleApiResponse(response),
      error: (err) => this.handleApiError(err)
    });
  }

  public loadPage(page: number): void {
    if (this.isLoading || !this.paginationInfo || page < 1 || page > this.paginationInfo.total_pages) {
      return;
    }
    this.fetchData(page, this.currentSearchTerm);
  }

  private fetchData(page: number, term: string): void {
    this.isLoading = true;
    this.fetchDataObservable(page, term).subscribe({
      next: (response) => this.handleApiResponse(response),
      error: (err) => this.handleApiError(err)
    });
  }

  private fetchDataObservable(page: number, term: string): Observable<PaginatedResponse<ClientItemResponse | InternalItemResponse>> {
    const pageSize = 12;
    const searchTerm = term.trim();

    if (searchTerm) {
      return this.productService.searchProducts(searchTerm, page, pageSize);
    } else {
      return this.productService.getPublicProducts(page, pageSize);
    }
  }

  private handleApiResponse(response: PaginatedResponse<ClientItemResponse | InternalItemResponse>): void {
    this.products = response.data;
    this.paginationInfo = response.pagination;
    this.isLoading = false;
  }

  private handleApiError(error: any): void {
    console.error("Falha ao carregar produtos", error);
    this.isLoading = false;
    this.products = [];
    this.paginationInfo = null;
  }


  get displayedPages(): number[] {
    if (!this.paginationInfo) return [];

    const { current_page, total_pages } = this.paginationInfo;
    const pagesToShow = 5;
    const pages: number[] = [];

    let startPage = Math.max(1, current_page - Math.floor(pagesToShow / 2));
    let endPage = Math.min(total_pages, startPage + pagesToShow - 1);

    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
