import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { PortalAdminService } from '../../services/service-portal/portal-admin.service';

@Component({
  selector: 'app-admin-tool',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-tool.component.html',
  styleUrl: './admin-tool.component.css',
})
export class AdminToolComponent {
  public portalAdminService = inject(PortalAdminService);
  isHovered = false;

  toggleMode() {
    this.portalAdminService.toggleAdminMode();
  }
}
