import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontSizeService } from '../../services/font-size.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  fontSizeService = inject(FontSizeService);
  public authService = inject(AuthService);
  public router = inject(Router);

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
