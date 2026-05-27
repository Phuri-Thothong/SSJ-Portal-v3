import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PortalAdminService } from '../../../services/service-portal/portal-admin.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  public adminService = inject(PortalAdminService);
}
