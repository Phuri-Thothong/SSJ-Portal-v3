import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Service } from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiURL = 'http://localhost:8000/api/services';
  public isLoading = signal(false);

  services = signal<Service[]>([]);

  constructor(private http: HttpClient) {}

  getServices(): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(this.apiURL);
  }

  getTrashedServices(): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(`${this.apiURL}/trashed`);
  }

  refreshServices(isTrashMode: boolean = false) {
    this.isLoading.set(true);
    const request$ = isTrashMode ? this.getTrashedServices() : this.getServices();
    request$.subscribe({
      next: (res) => {
        if (res.success) {
          // อัปเดต Signal ข้อมูลจะไหลไปยังทุกคอมโพเนนต์ที่ใช้ Signal services
          this.services.set(res.data ?? []);
          setTimeout(() => this.isLoading.set(false), 100);
        }
      },
      error: (err) => {
        this.isLoading.set(false)
        console.error('ไม่สามารถโหลดข้อมูลได้: ', err);
      }
    });
  }

  createService(service: Service): Observable<ApiResponse<Service>> {
    return this.http.post<ApiResponse<Service>>(this.apiURL, service);
  }

  updateService(id: number, service: Service): Observable<ApiResponse<Service>> {
    return this.http.put<ApiResponse<Service>>(`${this.apiURL}/${id}`, service);
  }

  deleteService(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiURL}/${id}`);
  }
}
