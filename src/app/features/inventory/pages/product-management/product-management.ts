import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {ProductService} from '../../../products/services/product';
import {NotificationService} from '../../../../shared/services/notification';
import {AuthService} from '../../../auth/services/auth/auth';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Modal} from 'bootstrap';
import {CreateItemRequest, InternalItemResponse, UpdateItemRequest} from '../../../../core/models/item.model';
import {PaginationInfo} from '../../../../core/models/pagination.models';
import {DecodedToken} from '../../../../core/models/user.model';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-product-management',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule
  ],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css'
})
export class ProductManagementComponent implements OnInit {
  private productService = inject(ProductService)
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  products: InternalItemResponse[] = []
  paginationInfo: PaginationInfo | null = null;
  currentUser: DecodedToken | null = null;

  productForm!: FormGroup;
  editingProductId: string | null = null;
  productModal: Modal | null = null;
  @ViewChild('productModalElement') productModalElement!: ElementRef;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()
    this.loadProducts(1)
    this.buildForm()
  }

  ngAfterViewInit() {
    this.productModal = new Modal(this.productModalElement.nativeElement)
  }

  buildForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      SKU: ['', Validators.required],
      description: ['', Validators.required],
      price_in_cents: [0, [Validators.required, Validators.min(0)]],
      price_cost_in_cents: [0, [Validators.required, Validators.min(0)]],
      stock_quantity: [0, [Validators.required, Validators.min(0)]],
      item_type: ['MATERIAL', Validators.required],
      can_be_sold: [true, Validators.required],
      active: [true, Validators.required],
      minimum_stock_level: [0, Validators.required],
      unit_of_measure: ['unidade', Validators.required],
    });
  }

  loadProducts(page: number): void {
    this.productService.getInternalProducts(page, 10).subscribe(response => {
      this.products = response.data;
      this.paginationInfo = response.pagination;
    })
  }

  openCreateModal(): void {
    this.editingProductId = null;
    this.productForm.reset({
      can_be_sold: true,
      active: true,
      item_type: 'MATERIAL',
      unit_of_measure: 'unidade'
    })
    this.productModal?.show()
  }

  openEditModal(product: InternalItemResponse): void {
    this.editingProductId = product.id;
    this.productForm.patchValue({
      ...product,
      price_in_cents: product.price_sale,
      price_cost_in_cents: product.price_cost,
      SKU: product.sku,
    });
    this.productModal?.show()
  }

  onFormSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const formValue = this.productForm.value;

    if (this.editingProductId) {
      const updatePayload: UpdateItemRequest = {
        name: formValue.name,
        description: formValue.description,
        is_active: formValue.active,
        can_be_sold: formValue.can_be_sold,
        price_sale_in_cents: formValue.price_in_cents,
        minimum_stock_level: formValue.minimum_stock_level,
      };

      this.productService.updateProduct(this.editingProductId, updatePayload).subscribe({
        next: () => {
          this.notificationService.show('Produto atualizado com sucesso!', 'success');
          this.productModal?.hide();
          this.loadProducts(this.paginationInfo?.current_page || 1);
        },
        error: (err) => this.notificationService.show('Erro ao atualizar produto.', 'error'),
      });

    } else {
      const createPayload: CreateItemRequest = formValue;
      this.productService.createProduct(createPayload).subscribe({
        next: () => {
          this.notificationService.show('Produto criado com sucesso!', 'success');
          this.productModal?.hide();
          this.loadProducts(1);
        },
        error: (err) => this.notificationService.show('Erro ao criar produto.', 'error'),
      });
    }
  }

  onDeleteProduct(product: InternalItemResponse): void {
    if (confirm(`Tem certeza que deseja deletar o produto ${product.name}?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.notificationService.show('Produto deletado com sucesso!', 'success');
          this.loadProducts(this.paginationInfo?.current_page || 1);
        },
        error: (err) => this.notificationService.show('Erro ao deletar produto.', 'error'),
      })
    }
  }
}
