import { Component, inject, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, TitleCasePipe, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import {ProductService} from '../../../products/services/product';
import {AuthService} from '../../../auth/services/auth/auth';
import {NotificationService} from '../../../../shared/services/notification';
import {CreateItemRequest, InternalItemResponse, UpdateItemRequest} from '../../../../core/models/item.model';
import {DecodedToken} from '../../../../core/models/user.model';
import {PaginationInfo} from '../../../../core/models/pagination.models';


@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './product-management.html',
  styleUrls: ['./product-management.css']
})
export class ProductManagementComponent implements OnInit, AfterViewInit {
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  public products: InternalItemResponse[] = [];
  public paginationInfo: PaginationInfo | null = null;
  public currentUser: DecodedToken | null = null;
  public isLoading = true;

  public productForm!: FormGroup;
  public editingProductId: string | null = null;
  public isSubmitting = false;

  private productModal: Modal | null = null;
  @ViewChild('productModalElement') productModalElement!: ElementRef;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.buildForm();
    this.loadProducts(1);
  }

  ngAfterViewInit(): void {
    if (this.productModalElement) {
      this.productModal = new Modal(this.productModalElement.nativeElement);
    }
  }

  buildForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      SKU: ['', Validators.required],
      description: [''],
      unit_of_measure: ['unidade', Validators.required],
      price_in_cents: [0, [Validators.required, Validators.min(0)]],
      price_cost_in_cents: [0, [Validators.required, Validators.min(0)]],
      stock_quantity: [0, [Validators.required, Validators.min(0)]],
      minimum_stock_level: [0, [Validators.required, Validators.min(0)]],
      item_type: ['MATERIAL', Validators.required],
      can_be_sold: [true, Validators.required],
      active: [true, Validators.required],
    });
  }

  loadProducts(page: number): void {
    this.isLoading = true;
    this.productService.getInternalProducts(page, 10).subscribe({
      next: (response) => {
        this.products = response.data;
        this.paginationInfo = response.pagination;
        this.isLoading = false;
      },
      error: (err) => {
        this.notificationService.show('Falha ao carregar produtos. Você pode não ter permissão.', 'error');
        this.isLoading = false;
      }
    });
  }

  openCreateModal(): void {
    this.editingProductId = null;
    this.productForm.reset({
      can_be_sold: true,
      active: true,
      item_type: 'MATERIAL',
      unit_of_measure: 'unidade'
    });
    this.productModal?.show();
  }

  openEditModal(product: InternalItemResponse): void {
    this.editingProductId = product.id;
    this.productForm.patchValue({
      name: product.name,
      SKU: product.sku,
      description: product.description,
      unit_of_measure: product.unit_of_measure,
      price_in_cents: product.price_sale,
      price_cost_in_cents: product.price_cost,
      stock_quantity: product.stock_quantity,
      minimum_stock_level: product.minimum_stock_level,
      item_type: product.item_type,
      can_be_sold: product.can_be_sold,
      active: product.is_active
    });
    this.productModal?.show();
  }

  onFormSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    if (this.editingProductId) {

      const updatePayload: UpdateItemRequest = this.productForm.value;
      this.productService.updateProduct(this.editingProductId, updatePayload).subscribe(this.getObserver());
    } else {

      const createPayload: CreateItemRequest = this.productForm.value;
      this.productService.createProduct(createPayload).subscribe(this.getObserver());
    }
  }

  onDeleteProduct(product: InternalItemResponse): void {
    const confirmation = confirm(`Tem certeza que deseja deletar o produto "${product.name}"?`);
    if (!confirmation) return;

    if (!this.paginationInfo) {
      this.notificationService.show('Erro: Informações da página não encontradas.', 'error');
      return;
    }

    const currentPage = this.paginationInfo.current_page;
    const isLastItemOnThisPage = this.products.length === 1 && currentPage > 1;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.notificationService.show('Produto deletado com sucesso!', 'success');
        const pageToReload = isLastItemOnThisPage ? currentPage - 1 : currentPage;
        this.loadProducts(pageToReload);
      },
      error: (err) => this.notificationService.show('Falha ao deletar o produto.', 'error')
    });
  }

  private getObserver() {
    return {
      next: () => {
        const message = this.editingProductId ? 'Produto atualizado!' : 'Produto criado!';
        this.notificationService.show(message, 'success');
        this.isSubmitting = false;
        this.productModal?.hide();
        this.loadProducts(this.paginationInfo?.current_page || 1);
      },
      error: (err: any) => {
        this.notificationService.show('Erro ao salvar produto.', 'error');
        this.isSubmitting = false;
      }
    };
  }
}
