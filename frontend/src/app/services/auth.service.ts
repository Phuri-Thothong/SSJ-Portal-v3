import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse, User } from '../models/user.model';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  rememberMeOption: boolean = false;
  currentUser = signal<User | null>(null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  login(credentials: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          if (res.success && res.token) {
            if (credentials.remember) {
              localStorage.setItem('ssj_token', res.token);
            } else {
              sessionStorage.setItem('ssj_token', res.token);
            }
            this.currentUser.set(res.user ?? null);
          }
        }),
      );
  }

  verifyStep1(national_id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-step1`, {
       national_id: national_id, 
    });
  }

  verifyStep2(username: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-step2`, { 
      username: username,
      email: email,
    });
  }

  activateAccount(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/activate-account`, data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }
  
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      finalize(() => {
        localStorage.removeItem('ssj_token');
        sessionStorage.removeItem('ssj_token');
        this.currentUser.set(null);
      }),
    );
  }

  checkMe() {
    return this.http.get<AuthResponse>(`${this.apiUrl}/me`).pipe(
      tap((res) => {
        if (res.success && res.user) {
          this.currentUser.set(res.user);
        }
      }),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      }),
    );
  }

  checkResetToken(payload: { token: string; email: string }) {
    return this.http.post<any>(`${this.apiUrl}/password/check-token`, payload);
  }

  verifySetup2FA(nationalId: string, otpCode: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify-setup-2fa`, {
      national_id: nationalId,
      otp_code: otpCode,
    }).pipe(
      tap((res) => {
        if (res.success && res.token && res.user) {
          if (this.rememberMeOption) {
            localStorage.setItem('ssj_token', res.token);
          } else {
            sessionStorage.setItem('ssj_token', res.token);
          }
          this.currentUser.set(res.user);
        }
      })
    );
  }

  verifyDaily2FA(nationalId: string, otpCode: string, rememberDevice: boolean): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify-daily-2fa`, {
      national_id: nationalId,
      otp_code: otpCode,
      remember_device: rememberDevice,
    }, {
      withCredentials: true,
    }).pipe(
      tap((res) => {
        if (res.success && res.token && res.user) {
          if (this.rememberMeOption) {
            localStorage.setItem('ssj_token', res.token);
          } else {
            sessionStorage.setItem('ssj_token', res.token);
          }
          this.currentUser.set(res.user);
        }
      })
    );
  }

  getDevices(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/devices`, {
      withCredentials: true,
    });
  }

  revokeDevice(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/devices/${id}`, {
      withCredentials: true,
    });
  }
}
