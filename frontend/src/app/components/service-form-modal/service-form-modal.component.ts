import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortalAdminService } from '../../services/service-portal/portal-admin.service';
import { PortalDataService } from '../../services/service-portal/portal-data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-service-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-form-modal.component.html',
  styleUrl: './service-form-modal.component.css',
})
export class ServiceFormModalComponent {
  public portalAdminService = inject(PortalAdminService);
  private portalDataService = inject(PortalDataService);
  private toastService = inject(ToastService);
  get isEditMode(): boolean {
    return this.portalAdminService.modalMode() === 'edit';
  }

  isShowCustomPicker = signal(false);
  customFrom = signal('#3b82f6');
  customTo = signal('#2dd4bf');
  formErrors = signal<any>(null);

  selectIcon(icon: string) {
    const data = this.portalAdminService.activeService();
    if (data) data.icon = icon;
  }

  selectGradient(from: string, to: string) {
    const data = this.portalAdminService.activeService();
    if (data) {
      data.color_from = from;
      data.color_to = to;
      this.isShowCustomPicker.set(false);
    }
  }

  toggleCustomPicker() {
    this.isShowCustomPicker.update((v) => !v);
  }

  clearFieldError(fieldName: string) {
    const currentErrors = this.formErrors();
    if (currentErrors && currentErrors[fieldName]) {
      const updatedErrors = { ...currentErrors };
      delete updatedErrors[fieldName];
      this.formErrors.set(Object.keys(updatedErrors).length > 0 ? updatedErrors : null);
    }
  }

  handleSave() {
    const data = this.portalAdminService.activeService();
    // ถ้าไม่มีข้อมูล หรือเป็นโหมดแก้ไขแต่ไม่มี ID ให้เด้งออก
    if (!data || (this.isEditMode && !data.id)) return;

    // ถ้าเปิด Custom Picker อยู่ ให้แปลงสี Hex เป็น Tailwind arbitrary value
    if (this.isShowCustomPicker()) {
      data.color_from = this.customFrom();
      data.color_to = this.customTo();
    }

    this.formErrors.set(null);

    const request$ = this.isEditMode
      ? this.portalDataService.updateService(data.id!, data)
      : this.portalDataService.createService(data);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.showToast(res.message ?? 'ดำเนินการสำเร็จ');
          this.portalAdminService.closeModal();
          this.portalDataService.refreshServices();
        }
      },
      error: (err) => {
        // Validation Error จาก Laravel
        if (err.status === 422) {
          const errors = err.error.errors;
          this.formErrors.set(errors);
          setTimeout(() => {
            const firstErrorKey = Object.keys(errors)[0];
            const errorElement = document.getElementById(`error-${firstErrorKey}`);
            if (errorElement) {
              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        } else {
          let errorMsg = 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง';
          if (err.status === 500) errorMsg = 'เซิร์ฟเวอร์เกิดข้อผิดพลาด';
          if (err.status === 0) errorMsg = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
          if (err.status === 404) errorMsg = 'ไม่พบที่อยู่ API';
          this.toastService.showToast(errorMsg, 'danger');
        }
      },
    });
  }
}
