import {Component, inject, OnInit} from '@angular/core';
import {ProductService} from '../../services/product';
import {ClientItemResponse} from '../../../../core/models/item.model';
import {PaginationInfo} from '../../../../core/models/pagination.models';
import {CommonModule, CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [
    CurrencyPipe,
    CommonModule,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService)

  products: ClientItemResponse[] = []
  paginationInfo: PaginationInfo | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadProducts(1)
  }

  loadProducts(page: number): void {
    this.isLoading = true;

    this.productService.getPublicProducts(page, 12).subscribe({
      next: (response) => {
        this.products = response.data;
        this.paginationInfo = response.pagination;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Falha ao carregar produtos", err);
        this.isLoading = false;
      }
    });
  }
}
