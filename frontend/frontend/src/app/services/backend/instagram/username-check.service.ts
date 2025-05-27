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

  private userInfo$: Observable<IgUserInfo> | null = null;
  private userInfoValue: IgUserInfo | null = null;

  constructor(private http: HttpClient) {}

  checkIGUsername(username: string): Observable<IgUserInfo> {
    if (this.userInfoValue && this.userInfoValue.username === username && this.userInfo$) {
      return this.userInfo$;
    }

    const encodedUsername = encodeURIComponent(username);
    const apiUrl = `${this.baseUrl}/api/instagram/users/${encodedUsername}`;

    this.userInfo$ = this.http.get<any>(apiUrl).pipe(
      map(response => {
        const userInfo: IgUserInfo = {
          id: response.id,
          username: username,
          profilePicUrl: response.profile_pic_url,
          isPrivate: response.is_private
        };
        this.userInfoValue = userInfo;
        return userInfo;
      })
    );

    return this.userInfo$;
  }

  clearUserInfo() {
    this.userInfo$ = null;
    this.userInfoValue = null;
  }
}
