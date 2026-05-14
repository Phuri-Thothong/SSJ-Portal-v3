import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirm-modal.component.html',
  styleUrl: './delete-confirm-modal.component.css',
})
export class DeleteConfirmModalComponent {
  public adminService = inject(AdminService);
  get isSoftDelete(): boolean {
    return this.adminService.modalMode() === 'delete';
  }

  onConfirm() {
    if (this.isSoftDelete) {
      this.adminService.confirmSoftDelete();
    } else {
      this.adminService.confirmForceDelete();
    }    
  }

  onCancel() {
    this.adminService.closeModal();
  }
}
