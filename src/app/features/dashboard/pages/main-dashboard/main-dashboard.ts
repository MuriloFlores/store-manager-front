import {Component, inject} from '@angular/core';
import {AuthService} from '../../../auth/services/auth/auth';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-main-dashboard',
  imports: [
    RouterLink
  ],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.css'
})
export class MainDashboardComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.getCurrentUser();


  onLogout(): void {
    this.authService.logout()
  }
}
