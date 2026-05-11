import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataService } from './services/data.service';
import { Service } from './models/service.model';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { SearchService } from './services/search.service';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminToolComponent } from './components/admin-tool/admin-tool.component';
import { AddServiceCardComponent } from './components/add-service-card/add-service-card.component';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ServiceCardComponent,
    HeroBannerComponent,
    NoResultsComponent,
    FooterComponent,
    NavbarComponent,
    AdminToolComponent,
    AddServiceCardComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  // รับข้อมูล Array ที่ได้จาก Backend
  services = signal<Service[]>([]);

  public adminService = inject(AdminService);

  constructor(
    private dataService: DataService,
    public searchService: SearchService,
  ) {}

  ngOnInit() {
    this.dataService.getServices().subscribe({
      next: (response) => {
        if (response.success) {
          // เก็บข้อมูลที่ดึงมาใส่ตัวแปร services เพื่อเอาไปวนลูปใน HTML
          this.services.set(response.data);
          console.log(this.services());
        }
      },
      error: (err) => console.error('เกิดข้อผิดพลาด:', err),
    });
  }

  filteredServices = computed(() => {
    const term = this.searchService.searchTerm().toLowerCase();
    const allServices = this.services();

    if (!term) return allServices;

    return allServices.filter(
      (s) => s.title.toLowerCase().includes(term) || s.description?.toLowerCase().includes(term),
    );
  });
}
