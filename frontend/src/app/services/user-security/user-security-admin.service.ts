import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';
import { UserAccountService } from './user-account.service';

@Injectable({ providedIn: 'root' })
export class UserSecurityAdminService {
  private http = inject(HttpClient);
  private userService = inject(UserAccountService);

  activeUser = signal<User | null>(null);
  
  modalMode = signal<'reset2fa' | null>(null);

  toastState = signal({
    show: false,
    message: '',
    type: 'success' as 'success' | 'danger',
  });

  openModal(mode: 'reset2fa', user: User) {
    this.modalMode.set(mode);
    this.activeUser.set(user);
  }

  closeModal() {
    this.modalMode.set(null);
    this.activeUser.set(null);
  }

  confirmReset2FA() {
    const user = this.activeUser();
    if (!user || !user.id) return;

    this.http.post<{ success: boolean; message: string }>(
      `${environment.apiUrl}/users/${user.id}/reset-2fa`, 
      {}
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast(res.message || 'ทำการรีเซ็ตระบบความปลอดภัย 2FA เรียบร้อยแล้ว');
          this.closeModal();
          this.userService.refreshUsers();
        }
      },
      error: (err) => {
        let errorMsg = 'ระบบเกิดข้อผิดพลาด ไม่สามารถรีเซ็ตข้อมูลความปลอดภัยได้ในขณะนี้';
        if (err.status === 403) errorMsg = 'คุณไม่มีสิทธิ์ในการดำเนินการในส่วนนี้';
        this.showToast(errorMsg, 'danger');
        console.error('Reset 2FA error:', err);
      }
    });
  }

  showToast(message: string, type: 'success' | 'danger' = 'success') {
    this.toastState.set({ show: true, message, type });
    this.playNotificationSound(type);
    setTimeout(() => this.hideToast(), 5000);
  }

  hideToast() {
    this.toastState.set({ ...this.toastState(), show: false });
  }

  private playNotificationSound(type: 'success' | 'danger') {
    try {
      const audioPath = type === 'success' ? '/assets/sounds/success.mp3' : '/assets/sounds/error.mp3';
      const audio = new Audio(audioPath);
      audio.volume = 1;
      audio.play();
    } catch (error) {
      console.warn('ไม่สามารถเล่นเสียงแจ้งเตือนได้:', error);
    }
  }
}
