import { inject, Injectable, signal } from '@angular/core';
import { Service } from '../models/service.model';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private dataService = inject(DataService);
  isAdminMode = signal(false);
  isTrashMode = signal(false);
  isEditMode = signal(false);
  isModalOpen = signal(false);
  isDeleteModalOpen = signal(false);

  // ข้อมูลที่กำลังแก้ไข-ตัวก๊อปปี้
  editingService = signal<Service | null>(null);
  // เก็บตัวจริงไว้ใช้อ้างอิงตอนบันทึกการแก้ไข
  originalService: Service | null = null;
  serviceToDelete = signal<Service | null>(null);
  toastState = signal({
    show: false,
    message: '',
    type: 'success' as 'success' | 'danger',
  });

  readonly availableIcons = [
    'fa-solid fa-house',
    'fa-solid fa-gear',
    'fa-solid fa-user',
    'fa-solid fa-file-medical',
    'fa-solid fa-stethoscope',
    'fa-solid fa-pills',
    'fa-solid fa-laptop-medical',
    'fa-solid fa-hospital',
    'fa-solid fa-calendar-check',
    'fa-solid fa-briefcase-medical',
    'fa-solid fa-notes-medical',
    'fa-solid fa-user-doctor',
    'fa-solid fa-heart-pulse',
    'fa-solid fa-syringe',
    'fa-solid fa-tooth',
    'fa-solid fa-microscope',
    'fa-solid fa-ambulance',
    'fa-solid fa-shield-halved',
    'fa-solid fa-chart-line',
    'fa-solid fa-database',
    'fa-solid fa-folder-open',
    'fa-solid fa-print',
    'fa-solid fa-comments',
    'fa-solid fa-network-wired',
    'fa-solid fa-brain',
    'fa-solid fa-graduation-cap',
    'fa-solid fa-money-bill-transfer',
    'fa-solid fa-map-location-dot',
    'fa-solid fa-boxes-stacked',
    'fa-solid fa-utensils',
  ];

  readonly availableGradients = [
    { from: '#475569', to: '#94a3b8' },
    { from: '#2563eb', to: '#2dd4bf' },
    { from: '#10b981', to: '#5eead4' },
    { from: '#fbbf24', to: '#f97316' },
    { from: '#f43f5e', to: '#ec4899' },
    { from: '#7c3aed', to: '#c084fc' },
    { from: '#fbcfe8', to: '#38bdf8' },
    { from: '#06b6d4', to: '#3b82f6' },
    { from: '#f97316', to: '#dc2626' },
    { from: '#f5d0fe', to: '#9333ea' },
    { from: '#a3e635', to: '#10b981' },
  ];

  toggleAdminMode() {
    this.isAdminMode.update((val) => {
      const nextMode = !val;
      //ถ้าจะปิดโหมดแอดมินให้ปิดโหมดถังขยะด้วย
      if (!nextMode) {
        this.isTrashMode.set(false);
      }
      return nextMode;
    });
    this.dataService.refreshServices();
  }

  toggleTrashMode() {
    if (!this.isAdminMode()) {
      this.isTrashMode.set(false);
      return;
    }
    this.isTrashMode.update((val) => !val);
    // this.dataService.refreshServices();
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.originalService = null;
    this.editingService.set({
      title: '',
      description: '',
      icon: 'fa-solid fa-star',
      link_url: '',
      is_new_tab: false,
      status: 'online',
      color_from: '#475569',
      color_to: '#94a3b8',
    });
    this.isModalOpen.set(true);
  }

  openEditModal(service: any) {
    this.isEditMode.set(true);
    this.originalService = service;
    this.editingService.set({ ...service });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  openDeleteConfirm(service: Service) {
    this.serviceToDelete.set(service);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    this.serviceToDelete.set(null);
  }

  confirmSoftDelete() {
    const service = this.serviceToDelete();
    if (!service || !service.id) return;
    console.log('เริ่มย้ายลงถังขยะ (Soft Delete):', service.title);
    this.dataService.deleteService(service.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast(res.message || 'ย้ายข้อมูลไปยังถังขยะเรียบร้อยแล้ว');
          this.closeDeleteModal();
          this.dataService.refreshServices();
        }
      },
      error: (err) => {
        let errorMsg = 'ไม่สามารถลบข้อมูลได้ในขณะนี้';
        if (err.status === 0) errorMsg = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
        this.showToast(errorMsg, 'danger');
        console.error('Delete error:', err);
      },
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
      const audioPath =
        type === 'success' ? '/assets/sounds/success.mp3' : '/assets/sounds/error.mp3';
      const audio = new Audio(audioPath);
      audio.volume = 1;
      audio.play();
    } catch (error) {
      console.warn('ไม่สามารถเล่นเสียงแจ้งเตือนได้:', error);
    }
  }
}
