import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private adminService = inject(AdminService);
  private router = inject(Router);

  credentials = {
    username: '',
    password: '',
  };

  isLoading = signal(false);

  onLogin(event: Event) {
    event.preventDefault();
    if (!this.credentials.username || !this.credentials.password) {
      this.adminService.showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'danger');
      return;
    }
    this.isLoading.set(true);

    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        if (res.success) {
          this.adminService.showToast('ยินดีต้อนรับเข้าสู่ระบบ', 'success');
          this.router.navigate(['/portal']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMessage = err.error?.message || 'การเชื่อมต่อล้มเหลว';
        this.adminService.showToast(errorMessage, 'danger');
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
