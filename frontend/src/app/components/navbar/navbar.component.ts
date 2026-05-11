import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontSizeService } from '../../services/font-size.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  fontSizeService = inject(FontSizeService);
}
