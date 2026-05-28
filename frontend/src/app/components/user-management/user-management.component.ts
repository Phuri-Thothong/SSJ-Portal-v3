import { Component, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountService } from '../../services/user-security/user-account.service';
import { UserSecurityAdminService } from '../../services/user-security/user-security-admin.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ResetTwofaModalComponent } from "../reset-twofa-modal/reset-twofa-modal.component";

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ResetTwofaModalComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  public userAccountService = inject(UserAccountService);
  public userSecurityAdminService = inject(UserSecurityAdminService);
  public authService = inject(AuthService);

  pending2FACount = computed(() => {
    const allUsers = this.userAccountService.users();
    return allUsers.filter(user => user.google2fa_enabled == 0 || !user.google2fa_enabled).length;
  });

  ngOnInit(): void {
    this.userAccountService.refreshUsers();
  }

  openResetModal(user: User) {
    this.userSecurityAdminService.openModal('reset2fa', user);
  }
}
