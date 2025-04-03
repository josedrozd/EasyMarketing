import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PingService {
  private apiUrl = 'http://localhost:8080/api/ping';

  constructor(private http: HttpClient) {}

  getPing(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
}