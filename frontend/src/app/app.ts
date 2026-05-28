import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/shared/toast/toast.component';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent, NavbarComponent],
  template: `
    <app-navbar *ngIf="shouldShowNavbar()" />
    <router-outlet />
    <app-toast />
  `,
})
export class App {
  private router = inject(Router);

  shouldShowNavbar(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.startsWith('/portal');
  }
}
