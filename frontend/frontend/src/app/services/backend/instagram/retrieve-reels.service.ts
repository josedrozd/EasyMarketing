import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface IGReelClipDTO {
  url: string;
  picUrl: string;
}

export interface IGUserClipsDTO {
  moreAvailable: boolean;
  nextMaxId: string;
  reelClips: IGReelClipDTO[];
}

@Injectable({
  providedIn: 'root',
})
export class IGClipsService {
  private baseUrl = environment.apiUrl;

  private reelClips: IGReelClipDTO[] = [];
  private nextMaxId: string | null = null;
  private moreAvailable: boolean = true;

  constructor(private http: HttpClient) {}

  getReelsByUserId(userId: number, maxId?: string): Observable<IGUserClipsDTO> {
    let params = new HttpParams();
    if (this.nextMaxId) {
      params = params.set('maxId', this.nextMaxId);
    }

    return this.http.get<IGUserClipsDTO>(`${this.baseUrl}/api/instagram/users/${userId}/clips`, { params }).pipe(
      tap((response: IGUserClipsDTO) => {
        this.reelClips = [...this.reelClips, ...response.reelClips];
        this.nextMaxId = response.nextMaxId;
        this.moreAvailable = response.moreAvailable;
      })
    );
  }

  getReelClips(): IGReelClipDTO[] {
    return this.reelClips;
  }

  clearReelClips(): void {
    this.reelClips = [];
    this.nextMaxId = null;
    this.moreAvailable = true;
  }

  hasMore(): boolean {
    return this.moreAvailable;
  }

  getNextMaxId(): string | null {
    return this.nextMaxId;
  }
}