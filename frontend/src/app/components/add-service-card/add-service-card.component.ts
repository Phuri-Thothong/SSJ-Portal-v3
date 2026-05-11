import { Component, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-add-service-card',
  standalone: true,
  imports: [],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.9)' }),
        animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', 
          style({ opacity: 0, transform: 'scale(0.5)', filter: 'blur(10px)' }))
      ])
    ])
  ],
  host: {'[@cardAnimation]': ''},
  templateUrl: './add-service-card.component.html',
  styleUrl: './add-service-card.component.css',
})
export class AddServiceCardComponent {
  public adminService = inject(AdminService);
}
