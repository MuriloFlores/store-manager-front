import {Component, inject} from '@angular/core';
import {AuthService} from '../../../features/auth/services/auth/auth';
import {TitleCasePipe} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [
    TitleCasePipe,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder)
  private router = inject(Router)

  public currentUser = this.authService.getCurrentUser();
  public searchForm = this.fb.group({
    term: ['']
  })

  onLogout(): void {
    this.authService.logout();
  }

  onSearch(): void {
    const term = this.searchForm.value.term?.trim();
    if (term) {
      this.router.navigate(['/products/search', {queryParams: { q: term } }])
    }
  }
}
