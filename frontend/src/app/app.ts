import { Component, computed, inject, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { SearchService } from './services/search.service';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminToolComponent } from './components/admin-tool/admin-tool.component';
import { AddServiceCardComponent } from './components/add-service-card/add-service-card.component';
import { AdminService } from './services/admin.service';
import { ServiceFormModalComponent } from './components/service-form-modal/service-form-modal.component';
import { CommonModule } from '@angular/common';
import { DeleteConfirmModalComponent } from "./components/delete-confirm-modal/delete-confirm-modal.component";
import { TrashBannerComponent } from "./components/trash-banner/trash-banner.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ServiceCardComponent,
    HeroBannerComponent,
    NoResultsComponent,
    FooterComponent,
    NavbarComponent,
    AdminToolComponent,
    AddServiceCardComponent,
    ServiceFormModalComponent,
    DeleteConfirmModalComponent,
    TrashBannerComponent
],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  // รับข้อมูล Array ที่ได้จาก Backend
  public dataService = inject(DataService);
  public adminService = inject(AdminService);
  public searchService = inject(SearchService);

  ngOnInit() {
    this.dataService.refreshServices();
  }

  filteredServices = computed(() => {
    const term = this.searchService.searchTerm().toLowerCase();
    const allServices = this.dataService.services();;

    if (!term) return allServices;

    return allServices.filter(
      (s) => s.title.toLowerCase().includes(term) || s.description?.toLowerCase().includes(term),
    );
  });
}
