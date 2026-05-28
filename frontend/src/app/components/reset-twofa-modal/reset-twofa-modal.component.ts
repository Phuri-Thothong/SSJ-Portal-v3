import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserSecurityAdminService } from '../../services/user-security/user-security-admin.service';

@Component({
  selector: 'app-reset-twofa-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reset-twofa-modal.component.html',
  styleUrl: './reset-twofa-modal.component.css',
})
export class ResetTwofaModalComponent {
  public userAdminService = inject(UserSecurityAdminService);
}
