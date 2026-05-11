import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminService {
  isAdminMode = signal(false);
  showModal = signal(false);

  toggleAdminMode() {
    this.isAdminMode.update(val => !val);
  }

  openFormModal() {
    this.showModal.set(true);
  }

  closeFormModal() {
    this.showModal.set(false);
  }
}
