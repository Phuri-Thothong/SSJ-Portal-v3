import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PasswordValidationService } from '../../services/password-validation.service';
import { PasswordChecklistComponent } from '../shared/password-checklist/password-checklist.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PasswordChecklistComponent], 
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private passwordValidator = inject(PasswordValidationService);

  formData = {
    email: '',
    token: '',
    password: '',
    confirmPassword: '',
  };

  isLoading = signal(false);
  isSubmitted = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isCheckingToken = signal(true);
  isTokenValid = signal(true);

  get isPasswordValid(): boolean {
    return this.passwordValidator.isPasswordValid(this.formData.password || '');
  }

  ngOnInit(): void {
    this.formData.email = this.route.snapshot.queryParams['email'] || '';
    this.formData.token = this.route.snapshot.queryParams['token'] || '';

    if (!this.formData.token || !this.formData.email) {
      this.isTokenValid.set(false);
      this.isCheckingToken.set(false);
      return;
    }

    const checkPayload = {
      token: this.formData.token,
      email: this.formData.email
    };

    this.authService.checkResetToken(checkPayload).subscribe({
      next: (res) => {
        if (res.success) {
          this.isTokenValid.set(true);
        }
        this.isCheckingToken.set(false);
      },
      error: (err) => {
        this.isTokenValid.set(false);
        this.isCheckingToken.set(false);
        const errorMsg = err.error?.message || 'ลิงก์กู้คืนรหัสผ่านหมดอายุหรือไม่ถูกต้อง';
        this.toastService.showToast(errorMsg, 'danger');
      }
    });
  }

  onResetPassword(event: Event) {
    event.preventDefault();
    this.isSubmitted.set(true);

    if (!this.formData.password || !this.formData.confirmPassword) {
      this.toastService.showToast('กรุณากรอกรหัสผ่านใหม่ให้ครบถ้วน', 'danger');
      return;
    }

    if (!this.isPasswordValid) {
      this.toastService.showToast('กรุณาตั้งรหัสผ่านให้ตรงตามเงื่อนไข', 'danger');
      return; 
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.toastService.showToast('รหัสผ่านที่กรอกทั้งสองช่องไม่ตรงกัน', 'danger');
      return;
    }

    this.isLoading.set(true);

    const payload = {
      email: this.formData.email,
      token: this.formData.token,
      password: this.formData.password,
      password_confirmation: this.formData.confirmPassword,
    };

    this.authService.resetPassword(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.showToast(res.message, 'success');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || 'การรีเซ็ตรหัสผ่านล้มเหลว';
        this.toastService.showToast(errorMsg, 'danger');
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
