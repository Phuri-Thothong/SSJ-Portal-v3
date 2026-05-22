import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivateAccountComponent } from "../activate-account/activate-account.component";
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ActivateAccountComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  public adminService = inject(AdminService);
  private router = inject(Router);

  credentials = {
    username: '',
    password: '',
    remember: false,
  };

  isLoading = signal(false);
  showPassword = signal(false);
  loginStep = signal<'NORMAL' | 'SETUP_2FA' | 'VERIFY_2FA'>('NORMAL');
  qrCodeImage = signal<string>('');
  google2faSecret = signal<string>('');
  isRememberDevice = signal<boolean>(false);
  otpCode = signal<string>('');
  tempNationalId = '';
  showActivateModal = false;

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

  async generateAndShowQRCode(qrCodeUrl: string, secret: string) {
    try {
      const base64Image = await QRCode.toDataURL(qrCodeUrl);
      this.qrCodeImage.set(base64Image);
      this.google2faSecret.set(secret);
    } catch (err) {
      console.error(err);
    }
  }
}
