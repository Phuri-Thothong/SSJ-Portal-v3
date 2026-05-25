import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-device-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-management.component.html',
  styleUrl: './device-management.component.css',
})
export class DeviceManagementComponent implements OnInit {
  private authService = inject(AuthService);
  private adminService = inject(AdminService);

  public devices = signal<any[]>([]);
  public isLoading = signal(false);

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
        this.adminService.showToast(errorMessage, 'danger');
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
    if (confirm('คุณต้องการสั่งยกเลิกการจดจำอุปกรณ์ที่เลือกใช่หรือไม่?\n(หากยกเลิกแล้ว อุปกรณ์ดังกล่าวจะต้องยืนยันรหัส OTP ใหม่ในการเข้าสู่ระบบครั้งถัดไป)')) {
      this.authService.revokeDevice(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.adminService.showToast(res.message, 'success');
            this.fetchDevices();
          }
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'เกิดข้อผิดพลาดในการยกเลิกสิทธิ์อุปกรณ์';
          this.adminService.showToast(errorMessage, 'danger');
        }
      });
    }
  }
}
