import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, inject, LOCALE_ID, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PortalAdminService } from '../../services/service-portal/portal-admin.service';
import localeTh from '@angular/common/locales/th';

registerLocaleData(localeTh, 'th')

@Component({
  selector: 'app-device-management',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'th' }
  ],
  templateUrl: './device-management.component.html',
  styleUrl: './device-management.component.css',
})
export class DeviceManagementComponent implements OnInit {
  private authService = inject(AuthService);
  private portalAdminService = inject(PortalAdminService);

  public devices = signal<any[]>([]);
  public isLoading = signal(false);
  public isModalOpen = signal(false);
  public selectedDeviceId = signal<number | null>(null);

  ngOnInit() {
    this.fetchDevices();
  }

  fetchDevices() {
    this.isLoading.set(true);
    this.authService.getDevices().subscribe({
      next: (res) => {
        if (res.success) {
          this.devices.set(res.devices);
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'ไม่สามารถดึงข้อมูลอุปกรณ์ได้';
        this.portalAdminService.showToast(errorMessage, 'danger');
      },
      complete: () => this.isLoading.set(false)
    });
  }

  parseDeviceName(userAgent: string): string {
    if (!userAgent) return 'ไม่ทราบอุปกรณ์';

    let os = 'ไม่ทราบระบบปฏิบัติการ';
    let browser = 'ไม่ทราบเบราว์เซอร์';

    if (userAgent.includes('Windows NT 10.0')) os = 'Windows 10 / 11';
    else if (userAgent.includes('Windows NT 6.3')) os = 'Windows 8.1';
    else if (userAgent.includes('Windows NT 6.2')) os = 'Windows 8';
    else if (userAgent.includes('Windows NT 6.1')) os = 'Windows 7';
    else if (userAgent.includes('Macintosh')) os = 'macOS';
    else if (userAgent.includes('iPhone')) os = 'iPhone (iOS)';
    else if (userAgent.includes('iPad')) os = 'iPad (iPadOS)';
    else if (userAgent.includes('Android')) os = 'Android OS';
    else if (userAgent.includes('Linux')) os = 'Linux';

    if (userAgent.includes('Edg/')) browser = 'Microsoft Edge';
    else if (userAgent.includes('Chrome/')) browser = 'Google Chrome';
    else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome')) browser = 'Apple Safari';
    else if (userAgent.includes('Firefox/')) browser = 'Mozilla Firefox';

    return `${browser} บนระบบปฏิบัติการ ${os}`;
  }

  onRevoke(id: number): void {
    this.selectedDeviceId.set(id);
    this.isModalOpen.set(true);
  }

  confirmRevoke(): void {
    const id = this.selectedDeviceId();
    if (id === null) return;
    this.authService.revokeDevice(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.portalAdminService.showToast(res.message, 'success');
          this.fetchDevices();
          this.isModalOpen.set(false);
          this.selectedDeviceId.set(null);
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'เกิดข้อผิดพลาดในการยกเลิกสิทธิ์อุปกรณ์';
        this.portalAdminService.showToast(errorMessage, 'danger');
        this.isModalOpen.set(false);
      }
    });
  }
}
