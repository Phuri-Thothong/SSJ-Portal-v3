import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PortalAdminService } from '../../services/service-portal/portal-admin.service';

@Component({
  selector: 'app-trash-banner',
  imports: [CommonModule],
  templateUrl: './trash-banner.component.html',
  styleUrl: './trash-banner.component.css',
})
export class TrashBannerComponent {
  public portalAdminService = inject(PortalAdminService);
}
