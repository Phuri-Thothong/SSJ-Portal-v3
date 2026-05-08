import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.css',
})
export class HeroBannerComponent {
  constructor(public searchService: SearchService) {}

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.updateSearchTerm(value);
  }
}
