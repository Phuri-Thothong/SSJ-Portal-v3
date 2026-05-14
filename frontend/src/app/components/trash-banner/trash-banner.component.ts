import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-trash-banner',
  imports: [CommonModule],
  templateUrl: './trash-banner.component.html',
  styleUrl: './trash-banner.component.css',
})
export class TrashBannerComponent {
  public adminService = inject(AdminService);
}
