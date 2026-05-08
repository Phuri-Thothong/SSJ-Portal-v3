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
}
