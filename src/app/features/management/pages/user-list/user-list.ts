import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';
import {NotificationService} from '../../../../shared/services/notification';
import {AuthService} from '../../../auth/services/auth/auth';
import {DecodedToken, UserResponse} from '../../../../core/models/user.model';
import {PaginationInfo} from '../../../../core/models/pagination.models';
import {UserManagementService} from '../../services/user-management';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserListComponent implements OnInit {
  private userManagementService = inject(UserManagementService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  users: UserResponse[] = []
  paginationInfo: PaginationInfo | null = null;
  currentUser: DecodedToken | null = null;

  allRoles: string[] = ['admin', 'manager', 'salesperson', 'client', 'stock_person', 'cashier'];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUsers(1)
  }

  loadUsers(page: number): void {
    console.log(`[COMPONENT] loadUsers chamado com o argumento page:`, page);

    if (page < 1 || page === undefined || page === null) {
      console.error('[COMPONENT] ERRO: Tentativa de carregar uma página inválida:', page);
      return;
    }
    const pageSize = 10;

    this.userManagementService.getUsers(page, pageSize).subscribe({
      next: (response) => {
        this.users = response.data;
        this.paginationInfo = response.pagination;
      },
      error: (err) => {
        this.notificationService.show('Falha ao carregar usuários.', 'error');
      }
    });
  }

  onRoleChange(user: UserResponse, newRole: string): void {
    if (user.role == newRole) return

    this.userManagementService.updateUserRole(user.id, newRole).subscribe({
      next: (updatedUser) => {
        this.notificationService.show(`Cargo de ${updatedUser.name} atualizado para ${newRole}.`, 'success');

        if (this.paginationInfo) {
          this.loadUsers(this.paginationInfo.currentPage);
        }
      },
      error: (err) => {
        this.notificationService.show('Erro ao atualizar o cargo do usuário: ' + err, 'error');
      }
    });
  }

  onDeleteUser(user: UserResponse): void {
    console.log('[COMPONENT] onDeleteUser iniciado. Estado atual:', {
      paginationInfo: this.paginationInfo,
      usersLength: this.users.length
    });

    if (!this.paginationInfo) {
      console.error('[COMPONENT] ERRO no onDeleteUser: paginationInfo é nulo. Abortando.');
      return;
    }

    const currentPage = this.paginationInfo.currentPage;
    const isLastItemOnThisPage = this.users.length === 1 && currentPage > 1;
    const pageToReload = isLastItemOnThisPage ? currentPage - 1 : currentPage;


    console.log('[COMPONENT] Valores calculados para recarregar:', { pageToReload });

    const confirmation = confirm(`Tem certeza que deseja deletar o usuário ${user.name}?`);

    if (confirmation) {
      this.userManagementService.deleteUser(user.id).subscribe({
        next: () => {
          this.notificationService.show(`Usuário ${user.name} deletado.`, 'success');


          console.log(`[COMPONENT] Sucesso na API de delete. Chamando loadUsers com a página:`, pageToReload);
          this.loadUsers(pageToReload);
        },
        error: (err) => {
          this.notificationService.show('Erro ao deletar usuário.', 'error');
        }
      });
    }
  }


  isEditingDisabled(user: UserResponse): boolean {
    if (!this.currentUser) return true;

    if (this.currentUser.role === 'admin') {
      return user.id === this.currentUser.id;
    }

    if (this.currentUser.role === 'manager') {
      return user.id === this.currentUser.id || user.role === 'manager' || user.role === 'admin';
    }

    return true;
  }
}
