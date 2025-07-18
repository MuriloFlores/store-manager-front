import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';
import {NotificationService} from '../../../../shared/services/notification';
import {AuthService} from '../../../auth/services/auth/auth';
import {DecodedToken, UserResponse} from '../../../../core/models/user.model';
import {PaginatedResponse, PaginationInfo} from '../../../../core/models/pagination.models';
import {UserManagementService} from '../../services/user-management';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, startWith, switchMap} from 'rxjs/operators';
import {Observable, tap} from 'rxjs';
import {ShortenNamePipe} from '../../../../shared/pipes/shorten-name-pipe';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, TitleCasePipe, ReactiveFormsModule, ShortenNamePipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserListComponent implements OnInit {
  private userManagementService = inject(UserManagementService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  public users: UserResponse[] = [];
  public paginationInfo: PaginationInfo | null = null;
  public currentUser: DecodedToken | null = null;
  public isLoading = true;
  public searchForm!: FormGroup;
  private currentSearchTerm = '';
  public allRoles: string[] = ['admin', 'manager', 'salesperson', 'client', 'stock_person', 'cashier'];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.searchForm = this.fb.group({ term: [''] });
    this.listenToSearchChanges();
  }

  private listenToSearchChanges(): void {
    this.searchForm.get('term')?.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      tap(term => {
        this.isLoading = true;
        this.currentSearchTerm = term || '';
      }),
      switchMap(term => this.fetchDataObservable(1, term))
    ).subscribe({
      next: response => this.handleApiResponse(response),
      error: err => this.handleApiError(err)
    });
  }

  public loadPage(page: number): void {
    if (this.isLoading || !this.paginationInfo || page < 1 || page > this.paginationInfo.total_pages) {
      return;
    }

    this.fetchData(page, this.currentSearchTerm);
  }

  public onRoleChange(user: UserResponse, newRole: string): void {
    if (user.role === newRole) return;

    this.userManagementService.updateUserRole(user.id, newRole).subscribe({
      next: (updatedUser) => {
        this.notificationService.show(`Cargo de ${updatedUser.name} atualizado para ${newRole}.`, 'success');
        this.loadPage(this.paginationInfo?.current_page || 1);
      },
      error: (err) => {
        this.notificationService.show('Erro ao atualizar o cargo do usuário.', 'error');
      }
    });
  }

  public onDeleteUser(user: UserResponse): void {
    if (!this.paginationInfo) { return; }
    const confirmation = confirm(`Tem certeza que deseja deletar o usuário "${user.name}"?`);
    if (!confirmation) return;

    const currentPage = this.paginationInfo.current_page;
    const isLastItemOnThisPage = this.users.length === 1 && currentPage > 1;

    this.userManagementService.deleteUser(user.id).subscribe({
      next: () => {
        this.notificationService.show('Usuário deletado com sucesso!', 'success');
        const pageToReload = isLastItemOnThisPage ? currentPage - 1 : currentPage;
        this.loadPage(pageToReload);
      },
      error: (err) => this.notificationService.show('Falha ao deletar o usuário.', 'error')
    });
  }

  public isEditingDisabled(user: UserResponse): boolean {
    if (!this.currentUser) return true;
    if (this.currentUser.role === 'admin') return user.id === this.currentUser.id;
    if (this.currentUser.role === 'manager') return user.id === this.currentUser.id || user.role === 'manager' || user.role === 'admin';
    return true;
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

  private fetchData(page: number, term: string): void {
    this.isLoading = true;
    this.fetchDataObservable(page, term).subscribe({
      next: response => this.handleApiResponse(response),
      error: err => this.handleApiError(err)
    });
  }

  private fetchDataObservable(page: number, term: string): Observable<PaginatedResponse<UserResponse>> {
    const pageSize = 10;
    const searchTerm = term.trim();
    return searchTerm
      ? this.userManagementService.searchUsers(searchTerm, page, pageSize)
      : this.userManagementService.getUsers(page, pageSize);
  }

  private handleApiResponse(response: PaginatedResponse<UserResponse>): void {
    this.users = response.data;
    this.paginationInfo = response.pagination;
    this.isLoading = false;
  }

  private handleApiError(error: any): void {
    console.error("Falha ao carregar usuários", error);
    this.notificationService.show('Falha ao carregar usuários.', 'error');
    this.isLoading = false;
    this.users = [];
    this.paginationInfo = null;
  }
}
