import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckPasswordService {

  private baseUrl = environment.apiUrl;
  
  private apiUrl = `${this.baseUrl}/api/security`;

  constructor(private http: HttpClient) {}

  checkPassword(password: string): Observable<boolean> {
    const params = new HttpParams().set('password', password);
    return this.http.get<boolean>(this.apiUrl, { params });
  }
  
}
