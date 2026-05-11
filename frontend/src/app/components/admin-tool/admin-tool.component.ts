import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-tool',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-tool.component.html',
  styleUrl: './admin-tool.component.css',
})
export class AdminToolComponent {
  public adminService = inject(AdminService);
  isHovered = false;

  toggleMode() {
    this.adminService.toggleAdminMode();
  }
}
