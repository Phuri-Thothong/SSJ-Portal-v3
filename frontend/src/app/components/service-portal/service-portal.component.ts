import { Component, computed, inject, OnInit } from '@angular/core';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { HeroBannerComponent } from '../hero-banner/hero-banner.component';
import { CommonModule } from '@angular/common';
import { NoResultsComponent } from '../no-results/no-results.component';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { AdminToolComponent } from '../admin-tool/admin-tool.component';
import { AddServiceCardComponent } from '../add-service-card/add-service-card.component';
import { ServiceFormModalComponent } from '../service-form-modal/service-form-modal.component';
import { DeleteConfirmModalComponent } from '../delete-confirm-modal/delete-confirm-modal.component';
import { TrashBannerComponent } from '../trash-banner/trash-banner.component';
import { ServiceSkeletonComponent } from '../service-skeleton/service-skeleton.component';
import { RestoreConfirmModalComponent } from '../restore-confirm-modal/restore-confirm-modal.component';
import { DataService } from '../../services/data.service';
import { AdminService } from '../../services/admin.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-service-portal',
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
    TrashBannerComponent,
    ServiceSkeletonComponent,
    RestoreConfirmModalComponent,
  ],
  templateUrl: './service-portal.component.html',
  styleUrl: './service-portal.component.css',
})
export class ServicePortalComponent implements OnInit {
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
