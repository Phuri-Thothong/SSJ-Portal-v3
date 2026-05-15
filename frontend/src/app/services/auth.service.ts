import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { AuthResponse, User } from "../models/user.model";
import { Observable, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private apiURL = 'http://localhost:8000/api';
    
    currentUser = signal<User | null>(null);
    isAdmin = computed(() => this.currentUser()?.role === 'admin');

    login(credentials: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiURL}/login`, credentials, {
            withCredentials: true
        }).pipe(
            tap(res => {
                if (res.success) this.currentUser.set(res.user ?? null);
            })
        )
    }

    logout() {
        return this.http.post(`${this.apiURL}/logout`, {}, { withCredentials: true })
            .pipe(tap(()=>this.currentUser.set(null)));
    }

    checkMe() {
        return this.http.get<{user: User}>(`${this.apiURL}/me`, { withCredentials: true })
            .subscribe({
                next: (res) => this.currentUser.set(res.user),
                error: () => this.currentUser.set(null)
            })
    }
}
