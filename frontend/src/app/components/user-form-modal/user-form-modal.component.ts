import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserSecurityAdminService } from '../../services/user-security/user-security-admin.service';
import { UserAccountService } from '../../services/user-security/user-account.service';
import { ToastService } from '../../services/toast.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form-modal.component.html',
  styleUrl: './user-form-modal.component.css',
})
export class UserFormModalComponent {
  public userSecurityAdminService = inject(UserSecurityAdminService);
  private userAccountService = inject(UserAccountService);
  private toastService = inject(ToastService);
  private http = inject(HttpClient);

  private allWorkgroups = [
    { name: 'การแพทย์แผนไทยและการแพทย์ทางเลือก', isSubGroup: false },
    { name: 'ควบคุมโรค', isSubGroup: false },
    { name: 'ควบคุมโรคไม่ติดต่อ', isSubGroup: false },
    { name: 'คุ้มครองผู้บริโภค', isSubGroup: false },
    { name: 'ทันตสาธารณสุข', isSubGroup: false },
    { name: 'นิติการ', isSubGroup: false },
    { name: 'บริหารทรัพยากรบุคคล', isSubGroup: false },
    { name: 'บริหารทั่วไป', isSubGroup: false },
    { name: 'งานการเงิน', isSubGroup: true },
    { name: 'สำนักอำนวยการ', isSubGroup: true },
    { name: 'ปฐมภูมิและเครือข่ายสุขภาพ', isSubGroup: false },
    { name: 'ประกันสุขภาพ', isSubGroup: false },
    { name: 'พัฒนาคุณภาพและรูปแบบบริการ', isSubGroup: false },
    { name: 'พัฒนายุทธศาสตร์สาธารณสุข', isSubGroup: false },
    { name: 'ส่งเสริมสุขภาพ', isSubGroup: false },
    { name: 'สุขภาพดิจิทัล', isSubGroup: false },
    { name: 'อนามัยสิ่งแวดล้อมและอาชีวอนามัย', isSubGroup: false }
  ];

  isDropdownOpen = signal<boolean>(false);
  searchTermWorkgroup = signal<string>('');
  formErrors = signal<any>(null);

  filteredWorkgroups = computed(() => {
    const search = this.searchTermWorkgroup().toLowerCase().trim();
    if (!search) {
      return this.allWorkgroups;
    }
    return this.allWorkgroups.filter(group => 
      group.name.toLowerCase().includes(search)
    );
  });

  setIsDropdownOpen(isOpen: boolean) {
    this.isDropdownOpen.set(isOpen);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen.update(v => !v);
  }

  filterWorkgroups(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTermWorkgroup.set(value);
    this.isDropdownOpen.set(true);
  }

  selectWorkgroup(groupName: string) {
    const data = this.userSecurityAdminService.activeUser();
    if (data) {
      data.workgroup = groupName;
    }
    this.isDropdownOpen.set(false);
    this.searchTermWorkgroup.set('');
    this.clearFieldError('workgroup');
  }

  clearFieldError(fieldName: string) {
    const currentErrors = this.formErrors();
    if (currentErrors && currentErrors[fieldName]) {
      const updatedErrors = { ...currentErrors };
      delete updatedErrors[fieldName];
      this.formErrors.set(Object.keys(updatedErrors).length > 0 ? updatedErrors : null);
    }
  }

  get isEditMode(): boolean {
    return this.userSecurityAdminService.modalMode() === 'edit';
  }

  handleSave() {
    const data = this.userSecurityAdminService.activeUser();
    if (!data || (this.isEditMode && !data.id)) return;
    this.formErrors.set(null);
    const request$ = this.isEditMode
      ? this.userAccountService.updateUser(data.id!, data)
      : this.userAccountService.createUser(data);
    request$.subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastService.showToast(res.message || 'ดำเนินการสำเร็จ');
          this.userSecurityAdminService.closeModal();
          this.userAccountService.refreshUsers();
        }
      },
      error: (err: any) => {
        if (err.status === 422) {
          const errors = err.error.errors || { national_id: [err.error.message] };
          this.formErrors.set(errors);
        } else {
          this.toastService.showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'danger');
        }
      }
    })
  }
}
