import { Component, OnInit, signal } from '@angular/core';
import { DataService } from './services/data.service';
import { Service } from './models/service.model';
import { ServiceCardComponent } from './components/service-card/service-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ServiceCardComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  // รับข้อมูล Array ที่ได้จาก Backend
  services = signal<Service[]>([]);

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getServices().subscribe({
      next: (response) => {
        if (response.success) {
          // เก็บข้อมูลที่ดึงมาใส่ตัวแปร services เพื่อเอาไปวนลูปใน HTML
          this.services.set(response.data);
          console.log(this.services());
        }
      },
      error: (err) => console.error('เกิดข้อผิดพลาด:', err)
    });
  }
}