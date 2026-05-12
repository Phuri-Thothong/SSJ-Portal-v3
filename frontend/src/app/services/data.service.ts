import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Service } from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiURL = 'http://localhost:8000/api/services';

  services = signal<Service[]>([]);

  constructor(private http: HttpClient) {}

  getServices(): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(this.apiURL);
  }

  refreshServices() {
    this.getServices().subscribe({
      next: (res) => {
        if (res.success) {
          // อัปเดต Signal ข้อมูลจะไหลไปยังทุกคอมโพเนนต์ที่ใช้ Signal services
          this.services.set(res.data ?? []);
        }
      }
    });
  }

  createService(service: Service): Observable<ApiResponse<Service>> {
    return this.http.post<ApiResponse<Service>>(this.apiURL, service);
  }
}
