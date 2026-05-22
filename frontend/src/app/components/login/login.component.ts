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
  otpInputs = signal<string[]>(['', '', '', '', '', '']);
  otpCode = '';
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
        const mockQrUrl = res.qr_code_url || 'otpauth://totp/SSJ-Portal?secret=NSTPHOFFICE2026';
        const mockSecret = res.google2fa_secret || 'NST2026SECRETKEY';

        this.generateAndShowQRCode(mockQrUrl, mockSecret);
        this.loginStep.set('SETUP_2FA');
        this.adminService.showToast('รหัสผ่านถูกต้อง กรุณาตั้งค่าระบบความปลอดภัย 2FA', 'success');
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMessage = err.error?.message || 'การเชื่อมต่อล้มเหลว';
        this.adminService.showToast(errorMessage, 'danger');
      },
      complete: () => this.isLoading.set(false)
    });
  }

  onOtpKeyUp(event: any, index: number) {
    const element = event.target;
    const value = element.value;

    if (value && index < 5) {
      const next = element.nextElementSibling as HTMLInputElement;
      if (next) next.focus();
    }

    if (event.key === 'Backspace' && index > 0 && !value) {
      const prev = element.previousElementSibling as HTMLInputElement;
      if (prev) prev.focus();
    }

    this.otpCode = this.otpInputs().join('');
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
