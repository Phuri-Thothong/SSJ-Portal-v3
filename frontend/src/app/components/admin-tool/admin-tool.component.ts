import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-admin-tool',
  imports: [CommonModule],
  templateUrl: './admin-tool.component.html',
  styleUrl: './admin-tool.component.css',
})
export class AdminToolComponent {
  isAdminMode = signal(false);
  isHovered = false;

  toggleMode() {
    this.isAdminMode.update(val => !val);
  }
}
