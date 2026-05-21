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

  currentStep = 1;
  totalSteps = 3;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

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
      phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
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
    this.errorMessage = '';

    if (this.isStepValid(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    } else {
      this.errorMessage = 'กรุณากรอกข้อมูลในขั้นตอนนี้ให้ถูกต้องและครบถ้วนก่อนไปขั้นตอนถัดไป';
    }
  }

  prevStep(): void {
    this.errorMessage = '';
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.activateForm.invalid) {
      this.errorMessage = 'กรุณาตรวจสอบข้อมูลและข้อกำหนดรหัสผ่านอีกครั้ง';
      return;
    }

    this.isLoading = true;

    this.authService.activateAccount(this.activateForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        this.activateForm.reset();
        this.currentStep = 1;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'เกิดข้อผิดพลาดจากระบบหลังบ้าน กรุณาลองเข้าใหม่';
      }
    })
  }

  handleFormSubmit(): void {
    if (this.currentStep < this.totalSteps) {
      this.nextStep();
    } else {
      this.onSubmit();
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}
