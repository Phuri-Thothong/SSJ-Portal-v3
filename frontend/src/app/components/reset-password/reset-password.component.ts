import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  public adminService = inject(AdminService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formData = {
    email: '',
    token: '',
    password: '',
    confirmPassword: ''
  };

  isLoading = signal(false);

  ngOnInit(): void {
    this.formData.email = this.route.snapshot.queryParams['email'] || '';
    this.formData.token = this.route.snapshot.queryParams['token'] || '';

    if (!this.formData.token || !this.formData.email) {
      this.adminService.showToast('ลิงก์กู้คืนรหัสผ่านไม่ถูกต้องหรือไม่สมบูรณ์', 'danger');
      this.router.navigate(['/login']);
    }
  }

  onResetPassword(event: Event) {
    event.preventDefault();

    if (!this.formData.password || !this.formData.confirmPassword) {
      this.adminService.showToast('กรุณากรอกรหัสผ่านใหม่ให้ครบถ้วน', 'danger');
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.adminService.showToast('รหัสผ่านที่กรอกทั้งสองช่องไม่ตรงกัน', 'danger');
      return;
    }

    this.isLoading.set(true);

    const payload = {
      email: this.formData.email,
      token: this.formData.token,
      password: this.formData.password,
    };

    this.authService.resetPassword(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.adminService.showToast(res.message, 'success');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || 'การรีเซ็ตรหัสผ่านล้มเหลว';
        this.adminService.showToast(errorMsg, 'danger');
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
