import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiURL = 'http://localhost:8000/api/services';

  constructor(private http: HttpClient) {}

  getServices(): Observable<{ success: boolean; data: Service[] }> {
    return this.http.get<{ success: boolean; data: Service[] }>(this.apiURL);
  }
}
