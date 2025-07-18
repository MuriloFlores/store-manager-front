import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  imports: [
    RouterOutlet,
    NgClass
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css'
})
export class AuthLayoutComponent implements OnInit {
  private router = inject(Router);

  public currentStep = 0;
  public progressWith = '0%'

  ngOnInit() {
    this.updateStep(this.router.url)

    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
        this.updateStep(event.urlAfterRedirects)
      }
    )
  }

  private updateStep(url: string): void {
    if (url.includes('/register')) {
      this.currentStep = 1
      this.progressWith = '0%'
    } else if (url.includes('/verify-otp')) {
      this.currentStep = 2
      this.progressWith = '100%'
    } else {
      this.currentStep = 0
    }
  }
}
