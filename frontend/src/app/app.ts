import { Component, computed, OnInit, signal } from '@angular/core';
import { DataService } from './services/data.service';
import { Service } from './models/service.model';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { SearchService } from './services/search.service';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ServiceCardComponent, HeroBannerComponent, NoResultsComponent, FooterComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  // รับข้อมูล Array ที่ได้จาก Backend
  services = signal<Service[]>([]);

  constructor(
    private dataService: DataService, 
    public searchService: SearchService
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
      error: (err) => console.error('เกิดข้อผิดพลาด:', err)
    });
  }

  filteredServices = computed(() => {
    const term = this.searchService.searchTerm().toLowerCase();
    const allServices = this.services();
    
    if (!term) return allServices;

    return allServices.filter(s => 
      s.title.toLowerCase().includes(term) || 
      s.description?.toLowerCase().includes(term)
    );
  });
}