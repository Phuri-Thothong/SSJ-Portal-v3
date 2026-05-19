import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordValidationService {
  hasMinLength(password: string): boolean {
    return password.length >= 8;
  }

  hasUpperCase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  hasLowerCase(password: string): boolean {
    return /[a-z]/.test(password);
  }

  hasNumber(password: string): boolean {
    return /[0-9]/.test(password);
  }

  hasSpecialChar(password: string): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);
  }

  isPasswordValid(password: string): boolean {
    return (
      this.hasMinLength(password) &&
      this.hasUpperCase(password) &&
      this.hasLowerCase(password) &&
      this.hasNumber(password) &&
      this.hasSpecialChar(password)
    );
  }
}
