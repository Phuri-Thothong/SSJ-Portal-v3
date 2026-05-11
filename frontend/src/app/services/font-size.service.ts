import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FontSizeService {
  // ค่าเริ่มต้นคือ medium
  currentSize = signal<'small' | 'medium' | 'large'>('medium');

  setSize(size: 'small' | 'medium' | 'large') {
    this.currentSize.set(size);
    document.documentElement.setAttribute('data-size', size);
  }
}