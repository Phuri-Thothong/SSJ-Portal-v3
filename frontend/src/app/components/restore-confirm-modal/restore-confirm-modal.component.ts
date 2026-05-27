import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PortalAdminService } from '../../services/service-portal/portal-admin.service';

@Component({
  selector: 'app-restore-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restore-confirm-modal.component.html',
  styleUrl: './restore-confirm-modal.component.css',
})
export class RestoreConfirmModalComponent {
  public portalAdminService = inject(PortalAdminService);

  onConfirm() {
    this.portalAdminService.confirmRestore();
  }

  onCancel() {
    this.portalAdminService.closeModal();
  }
}
