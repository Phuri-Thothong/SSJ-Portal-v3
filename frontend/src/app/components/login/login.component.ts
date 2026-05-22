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
        if (res.success) {
          this.tempNationalId = res.national_id || '';
          if (res.google2fa_enabled === 1) {
            this.loginStep.set('VERIFY_2FA');
            this.adminService.showToast('กรุณากรอกรหัส OTP จากแอป Google Authenticator', 'success');
          } else if (res.google2fa_enabled === 0) {
            const qrUrl = res.qr_code_url || '';
            const secret = res.google2fa_secret || '';
            this.generateAndShowQRCode(qrUrl, secret);
            this.loginStep.set('SETUP_2FA');
            this.adminService.showToast('รหัสผ่านถูกต้อง กรุณาตั้งค่าระบบความปลอดภัย 2FA', 'success');
          }
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

  onOtpKeyUp(event: any, index: number) {
    const element = event.target as HTMLInputElement;
    let value = element.value;

    if (/[^0-9]/g.test(value)) {
      value = value.replace(/[^0-9]/g, ''),
      element.value = value;
      this.otpInputs()[index] = value;
    }

    this.otpCode = this.otpInputs().join('');

    if (value && index < 5) {
      const next = element.nextElementSibling as HTMLInputElement;
      if (next) next.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    const element = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && index > 0 && !element.value) {
      const prev = element.previousElementSibling as HTMLInputElement;
      if (prev) prev.focus();
      setTimeout(() => prev.select(), 0);
    }
  }

  onVerifySetup2FA(): void{
    if (this.isLoading()) {
      return;
    }
    this.otpCode = this.otpInputs().join('');
    if (this.otpCode.length != 6) {
      this.adminService.showToast('กรุณากรอกรหัสความปลอดภัยให้ครบ 6 หลัก', 'danger');
      return;
    }
    this.isLoading.set(true);
    this.authService.verifySetup2FA(this.tempNationalId, this.otpCode).subscribe({
      next: (res) => {
        if (res.success) {
          this.adminService.showToast('เปิดใช้งานระบบ 2FA และเข้าสู่ระบบสำเร็จ', 'success');
          this.otpInputs.set(['', '', '', '', '', '']);
          this.otpCode = '';
          this.router.navigate(['/portal']); 
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMessage = err.error?.message || 'รหัส OTP ไม่ถูกต้อง';
        this.adminService.showToast(errorMessage, 'danger');
      },
    });
  }

  onVerifyDaily2FA(): void{
    if (this.isLoading()) {
      return;
    }
    this.otpCode = this.otpInputs().join('');
    if (this.otpCode.length != 6) {
      this.adminService.showToast('กรุณากรอกรหัสความปลอดภัยให้ครบ 6 หลัก', 'danger');
      return;
    }
    this.isLoading.set(true);
    this.authService.verifyDaily2FA(this.tempNationalId, this.otpCode).subscribe({
      next: (res) => {
        if (res.success) {
          this.adminService.showToast('ยินดีต้อนรับเข้าสู่ระบบพอร์ทัล สสจ. นครศรีฯ', 'success');
          this.otpInputs.set(['', '', '', '', '', '']);
          this.otpCode = '';
          this.router.navigate(['/portal']); 
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMessage = err.error?.message || 'รหัส OTP ไม่ถูกต้อง';
        this.adminService.showToast(errorMessage, 'danger');
      },
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
