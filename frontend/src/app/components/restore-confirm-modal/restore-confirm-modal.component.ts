import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-restore-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restore-confirm-modal.component.html',
  styleUrl: './restore-confirm-modal.component.css',
})
export class RestoreConfirmModalComponent {
  public adminService = inject(AdminService);

  onConfirm() {
    this.adminService.confirmRestore();
  }

  onCancel() {
    this.adminService.closeModal();
  }
}
