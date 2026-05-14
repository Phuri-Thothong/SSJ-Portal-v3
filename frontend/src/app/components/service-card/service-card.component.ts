import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Service } from '../../models/service.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css',
})
export class ServiceCardComponent {
  //รับ obj. จากคอมโพเนนต์ App มาเป็น prop.
  @Input() service!: Service;
  @Input() isInTrash: boolean = false;
  public adminService = inject(AdminService);

  mouseX = 0;
  mouseY = 0;

  onMouseMove(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }

  handleEdit(event: Event) {
    event.stopPropagation();
    this.adminService.openEditModal(this.service);
  }

  handleDelete(event: Event) {
    event.stopPropagation();
    this.adminService.openDeleteConfirm(this.service);
  }

  handleRestore(event: Event) {

  }

  handleForceDelete(event: Event) {
    
  }

  getStatusConfig() {
    switch (this.service.status) {
      case 'online':
        return {
          color: 'bg-emerald-500',
          icon: 'fa-check',
          label: 'พร้อมใช้งาน',
        };
      case 'maintenance':
        return {
          color: 'bg-amber-500',
          icon: 'fa-screwdriver-wrench',
          label: 'ไม่พร้อมใช้งาน',
        };
      default:
        return {
          color: 'bg-slate-400',
          icon: 'fa-question',
          label: 'ไม่ทราบสถานะ',
        };
    }
  }

  getButtonStyles() {
    switch (this.service.status) {
      case 'online':
        return {
          background: 'linear-gradient(to right, #2563eb, #2dd4bf)',
          cursor: 'pointer',
          opacity: '1',
          'box-shadow': '0 4px 15px rgba(37, 99, 235, 0.25)',
        };
      case 'maintenance':
        return {
          background: 'linear-gradient(to right, #64748b, #94a3b8)',
          cursor: 'not-allowed',
          opacity: '0.8',
          'box-shadow': 'none',
        };
      default:
        return {};
    }
  }
}
