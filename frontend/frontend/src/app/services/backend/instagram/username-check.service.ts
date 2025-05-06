import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IgUserInfo } from '../../../core/models/ig-user-info';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsernameCheckService {
  
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  checkIGUsername(username: string): Observable<IgUserInfo> {
    const encodedUsername = encodeURIComponent(username);
    const apiUrl = `${this.baseUrl}/api/instagram/users/${encodedUsername}`;
    return this.http.get<any>(apiUrl).pipe(
      map(response => ({
        id: response.id,
        profilePicUrl: `${response.profile_pic_url}`,
        isPrivate: response.is_private
      }))
    );
  }

}
