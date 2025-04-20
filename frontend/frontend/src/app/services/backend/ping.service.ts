import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PingService {
  
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/api/ping`;

  constructor(private http: HttpClient) {}

  getPing(): Observable<string> {
    console.log(this.baseUrl);
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
}