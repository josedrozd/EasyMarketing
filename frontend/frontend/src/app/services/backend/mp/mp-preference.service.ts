import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MpPreferenceService {
  
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/mp/preferences/create`;

  constructor(private http: HttpClient) {}

  createPreference(): Observable<string> {
    return this.http.post(this.apiUrl, {}, { responseType: 'text' });
  }

}
