import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IgUserInfo } from '../../../core/models/ig-user-info';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsernameCheckService {

  constructor(private http: HttpClient) {}

  checkIGUsername(username: string): Observable<IgUserInfo> {
    const apiUrl = `/instagram/users/${username}`;
    return this.http.get<any>(apiUrl).pipe(
      map(response => ({
        id: response.id,
        profilePicUrl: `data:image/jpeg;base64,${response.profile_pic_url}`,
        isPrivate: response.is_private
      }))
    );
  }

}
