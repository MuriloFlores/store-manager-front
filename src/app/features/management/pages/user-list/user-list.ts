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
    if (page < 1) return
    const pageSize = 10

    this.userManagementService.getUsers(page, pageSize).subscribe(response => {
      this.users = response.data;
      this.paginationInfo = response.pagination
    })
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
    if (!this.paginationInfo) {
      console.error('Não é possível deletar: informações da paginação não estão disponíveis.');
      return;
    }

    const currentPage = this.paginationInfo.currentPage;
    const isLastItemOnPage = this.users.length === 1 && currentPage > 1;

    const confirmation = confirm(`Tem certeza que deseja deletar o usuário ${user.name}? Esta ação não pode ser desfeita.`);

    if (confirmation) {
      this.userManagementService.deleteUser(user.id).subscribe({
        next: () => {
          this.notificationService.show(`Usuário ${user.name} deletado com sucesso.`, 'success');

          const pageToReload = isLastItemOnPage ? currentPage - 1 : currentPage;

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
