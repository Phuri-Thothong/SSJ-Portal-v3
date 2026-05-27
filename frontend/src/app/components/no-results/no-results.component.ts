import { Component, inject } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { PortalAdminService } from '../../services/service-portal/portal-admin.service';

@Component({
  selector: 'app-no-results',
  standalone: true,
  imports: [],
  templateUrl: './no-results.component.html',
  styleUrl: './no-results.component.css',
})
export class NoResultsComponent {
  searchService = inject(SearchService);
  portalAdminService = inject(PortalAdminService);
}
