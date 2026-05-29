import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserApiResponse } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  public isLoading = signal<boolean>(false);
  public users = signal<User[]>([]);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  refreshUsers() {
    this.isLoading.set(true);
    this.getUsers().subscribe({
      next: (res) => {
        this.users.set(res ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('ไม่สามารถดึงข้อมูลเจ้าหน้าที่ได้: ', err);
      }
    });
  }

  createUser(user: Partial<User>): Observable<UserApiResponse<User>> {
    return this.http.post<UserApiResponse<User>>(this.apiUrl, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<UserApiResponse<User>> {
    return this.http.put<UserApiResponse<User>>(`${this.apiUrl}/${id}`, user);
  }
}
