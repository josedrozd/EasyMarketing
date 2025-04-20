import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MpPreferenceService {
  
  private apiUrl = '/mp/preferences/create';

  constructor(private http: HttpClient) {}

  createPreference(): Observable<string> {
    return this.http.post(this.apiUrl, {}, { responseType: 'text' });
  }

}
