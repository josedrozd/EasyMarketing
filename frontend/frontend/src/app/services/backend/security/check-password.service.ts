import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckPasswordService {

  private apiUrl = 'http://localhost:8080/security';

  constructor(private http: HttpClient) {}

  checkPassword(password: string): Observable<boolean> {
    const params = new HttpParams().set('password', password);
    return this.http.get<boolean>(this.apiUrl, { params });
  }
  
}
