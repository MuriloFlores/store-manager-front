import {Component, inject} from '@angular/core';
import {AuthService} from '../../../features/auth/services/auth/auth';
import {TitleCasePipe} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    TitleCasePipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  public currentUser = this.authService.getCurrentUser();

  onLogout(): void {
    this.authService.logout();
  }
}
