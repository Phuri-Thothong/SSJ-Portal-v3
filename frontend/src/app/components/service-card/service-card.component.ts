import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Service } from '../../models/service.model';

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

  mouseX = 0;
  mouseY = 0;

  onMouseMove(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }

  getStatusConfig() {
    switch (this.service.status) {
      case 'online':
        return { color: 'bg-green-500', icon: 'fa-check' };
      case 'maintenance':
        return { color: 'bg-orange-500', icon: 'fa-screwdriver-wrench' };
      default:
        return { color: 'bg-slate-400', icon: 'fa-question' };
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
          background: 'linear-gradient(to right, #94a3b8, #64748b)',
          cursor: 'not-allowed',
          opacity: '0.8',
          'box-shadow': 'none',
        };
      default:
        return {};
    }
  }
}
