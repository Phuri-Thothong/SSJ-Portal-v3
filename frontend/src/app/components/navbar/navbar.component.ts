import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { FontSizeService } from '../../services/font-size.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  fontSizeService = inject(FontSizeService);
  public authService = inject(AuthService);
  public router = inject(Router);
  private elementRef = inject(ElementRef);

  isProfileMenuOpen = signal<boolean>(false);

  toggleProfileMenu() {
    this.isProfileMenuOpen.update(state => !state);
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen.set(false);
    }
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    })
  }
}
