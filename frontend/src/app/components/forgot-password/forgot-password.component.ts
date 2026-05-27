import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PortalAdminService } from '../../services/service-portal/portal-admin.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  public portalAdminService = inject(PortalAdminService);
  private router = inject(Router);

  email = '';
  isLoading = signal(false);

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.email) {
      this.portalAdminService.showToast('กรุณากรอกอีเมลบุคลากร', 'danger');
      return;
    }

    this.isLoading.set(true);

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        if (res.success) {
          this.portalAdminService.showToast(res.message, 'success');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || 'ไม่สามารถเชื่อมต่อระบบได้';
        this.portalAdminService.showToast(errorMsg, 'danger');
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
