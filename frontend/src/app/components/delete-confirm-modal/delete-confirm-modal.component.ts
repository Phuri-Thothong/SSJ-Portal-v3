import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PortalAdminService } from '../../services/service-portal/portal-admin.service';

@Component({
  selector: 'app-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirm-modal.component.html',
  styleUrl: './delete-confirm-modal.component.css',
})
export class DeleteConfirmModalComponent {
  public portalAdminService = inject(PortalAdminService);
  get isSoftDelete(): boolean {
    return this.portalAdminService.modalMode() === 'delete';
  }

  onConfirm() {
    if (this.isSoftDelete) {
      this.portalAdminService.confirmSoftDelete();
    } else {
      this.portalAdminService.confirmForceDelete();
    }    
  }

  onCancel() {
    this.portalAdminService.closeModal();
  }
}
