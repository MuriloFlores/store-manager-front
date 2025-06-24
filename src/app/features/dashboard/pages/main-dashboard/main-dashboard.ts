import {Component, inject} from '@angular/core';
import {AuthService} from '../../../auth/services/auth/auth';

@Component({
  selector: 'app-main-dashboard',
  imports: [],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.css'
})
export class MainDashboardComponent {
  private authService = inject(AuthService);


  onLogout(): void {
    this.authService.logout()
  }
}
