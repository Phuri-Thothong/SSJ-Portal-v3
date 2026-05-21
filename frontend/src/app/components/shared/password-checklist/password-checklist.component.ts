import { Component, inject, Input, signal } from '@angular/core';
import { PasswordValidationService } from '../../../services/password-validation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-checklist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-checklist.component.html',
  styleUrl: './password-checklist.component.css',
})
export class PasswordChecklistComponent {
  private passwordValidator = inject(PasswordValidationService);

  @Input() passwordValue: string = '';
  @Input() isSubmitted: boolean = false;

  get hasMinLength(): boolean {
    return this.passwordValidator.hasMinLength(this.passwordValue);
  }

  get hasUpperCase(): boolean {
    return this.passwordValidator.hasUpperCase(this.passwordValue);
  }

  get hasLowerCase(): boolean {
    return this.passwordValidator.hasLowerCase(this.passwordValue);
  }

  get hasNumber(): boolean {
    return this.passwordValidator.hasNumber(this.passwordValue);
  }

  get hasSpecialChar(): boolean {
    return this.passwordValidator.hasSpecialChar(this.passwordValue);
  }

  getRuleState(isValid: boolean): string {
    if (isValid) return 'passed';
    if (this.isSubmitted && !isValid) return 'error';
    return 'default';
  }
}
