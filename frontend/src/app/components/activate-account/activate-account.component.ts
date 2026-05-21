import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PasswordChecklistComponent } from "../shared/password-checklist/password-checklist.component";

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PasswordChecklistComponent],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css',
})
export class ActivateAccountComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  activateForm! : FormGroup;

  currentStep = signal(1);
  totalSteps = 3;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.activateForm = this.fb.group({
      national_id: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^0\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('password_confirmation')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  isStepValid(step: number): boolean {
    if (step === 1) {
      const nationalIdControl = this.activateForm.get('national_id');
      return !!(nationalIdControl && nationalIdControl.valid);
    }
    if (step === 2) {
      const username = this.activateForm.get('username');
      const email = this.activateForm.get('email');
      const phone = this.activateForm.get('phone');
      return !!(username?.valid && email?.valid && phone?.valid);
    }
    return this.activateForm.valid;
  }

  nextStep(): void {
    this.errorMessage.set('');

    if (!this.isStepValid(this.currentStep())) {
      this.errorMessage.set('กรุณากรอกข้อมูลในขั้นตอนนี้ให้ถูกต้องและครบถ้วนก่อนไปขั้นตอนถัดไป');
      return;
    }

    if (this.currentStep() === 1) {
      const national_id = this.activateForm.get('national_id')?.value;
      this.isLoading.set(true);

      this.authService.verifyStep1(national_id).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res && res.success) {
            this.currentStep.set(2);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'ไม่พบข้อมูลบุคลากรรายนี้ในระบบ หรือบัญชีนี้ถูกเปิดใช้งานไปแล้ว');
        }
      });
    } else if (this.currentStep() === 2) {
      const username = this.activateForm.get('username')?.value;
      const email = this.activateForm.get('email')?.value;
      this.isLoading.set(true);

      this.authService.verifyStep2(username, email).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res && res.success) {
            this.currentStep.set(3);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          const validationErrors = err.error?.errors;
          if (validationErrors) {
            const errorMessages = Object.values(validationErrors).flat();
            this.errorMessage.set(errorMessages.join(' และ '));
          } else {
            this.errorMessage.set(err.error?.errorMessage || 'ชื่อผู้ใช้งานหรืออีเมลนี้มีผู้ใช้ในระบบแล้ว');
          }
        }
      });
    } else {
      if (this.currentStep() < this.totalSteps) {
        this.currentStep.update(step => step + 1);
      }
    }
  }

  prevStep(): void {
    this.errorMessage.set('');
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.activateForm.invalid) {
      this.errorMessage.set('กรุณาตรวจสอบข้อมูลและข้อกำหนดรหัสผ่านอีกครั้ง');
      return;
    }

    this.isLoading.set(true);

    this.authService.activateAccount(this.activateForm.value).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set(response?.message || 'เปิดใช้งานบัญชีบุคลากรเสร็จสิ้นสมบูรณ์!');
        this.activateForm.reset();
      },
      error: (err) => {
        this.isLoading.set(false);
          const validationErrors = err.error?.errors;
          if (validationErrors) {
            const errorMessages = Object.values(validationErrors).flat();
            this.errorMessage.set(errorMessages.join(' และ '));
          } else {
            this.errorMessage.set(err.error?.message || 'เกิดข้อผิดพลาดจากระบบหลังบ้าน กรุณาลองเข้าใหม่');
          }
      }
    })
  }

  handleFormSubmit(): void {
    if (this.currentStep() < this.totalSteps) {
      this.nextStep();
    } else {
      this.onSubmit();
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}
