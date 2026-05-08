import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchTerm = signal<string>('');

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  clearSearch() {
    this.searchTerm.set('');
  }
}