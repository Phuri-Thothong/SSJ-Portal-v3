import { Component, inject } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-add-service-card',
  standalone: true,
  imports: [],
  templateUrl: './add-service-card.component.html',
  styleUrl: './add-service-card.component.css',
})
export class AddServiceCardComponent {
  public adminService = inject(AdminService);

  openModal() {
    this.adminService.openFormModal();
  }
}
