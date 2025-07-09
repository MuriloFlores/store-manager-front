import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // 1. Importe o CommonModule para usar @if
import { RouterLink } from '@angular/router';
import {AuthService} from '../../../auth/services/auth/auth';
import {DecodedToken} from '../../../../core/models/user.model'; // 2. Importe o RouterLink para usar o routerLink no HTML


@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './main-dashboard.html',
  styleUrls: ['./main-dashboard.css']
})
export class MainDashboardComponent {
  private authService = inject(AuthService);


  public currentUser: DecodedToken | null = this.authService.getCurrentUser();

  onLogout(): void {
    this.authService.logout();
  }
}
