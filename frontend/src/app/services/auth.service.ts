import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse, User } from '../models/user.model';
import { catchError, finalize, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:8000/api';

  currentUser = signal<User | null>(null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  login(credentials: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiURL}/login`, credentials, {
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
    return this.http.post(`${this.apiURL}/verify-step1`, {
       national_id: national_id, 
    });
  }

  verifyStep2(username: string, email: string): Observable<any> {
    return this.http.post(`${this.apiURL}/verify-step2`, { 
      username: username,
      email: email,
    });
  }

  activateAccount(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/activate-account`, data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiURL}/forgot-password`, { email });
  }
  
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/reset-password`, data);
  }

  logout() {
    return this.http.post(`${this.apiURL}/logout`, {}).pipe(
      finalize(() => {
        localStorage.removeItem('ssj_token');
        sessionStorage.removeItem('ssj_token');
        this.currentUser.set(null);
      }),
    );
  }

  checkMe() {
    return this.http.get<AuthResponse>(`${this.apiURL}/me`).pipe(
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
    return this.http.post<any>(`${this.apiURL}/password/check-token`, payload);
  }

  generate2FALink(nationalId: string): Observable<any> {
    return this.http.post(`${this.apiURL}/auth/generate-2fa`, {
      national_id: nationalId
    });
  }
}
