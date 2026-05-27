import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toastState = signal({
    show: false,
    message: '',
    type: 'success' as 'success' | 'danger',
  });

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
      const audio = new Audio(type === 'success' ? '/assets/sounds/success.mp3' : '/assets/sounds/error.mp3');
      audio.volume = 1;
      audio.play();
    } catch (e) { console.warn(e); }
  }
}
