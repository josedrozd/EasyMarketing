import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface IGMediaPostDTO {
  url: string;
  picUrl: string;
}

export interface IGUserMediaDTO {
  moreAvailable: boolean;
  nextMaxId: string;
  mediaPosts: IGMediaPostDTO[];
}

@Injectable({
  providedIn: 'root',
})
export class IGMediaService {
  private baseUrl = 'http://localhost:8080';

  private mediaPosts: IGMediaPostDTO[] = [];
  private nextMaxId: string | null = null;
  private moreAvailable: boolean = true;

  constructor(private http: HttpClient) {}

  getMediaByUserId(userId: number, maxId?: string): Observable<IGUserMediaDTO> {
    let params = new HttpParams();
    if (this.nextMaxId) {
      params = params.set('maxId', this.nextMaxId);
    }

    return this.http.get<IGUserMediaDTO>(`${this.baseUrl}/instagram/users/${userId}/media`, { params }).pipe(
      tap((response: IGUserMediaDTO) => {
        this.mediaPosts = [...this.mediaPosts, ...response.mediaPosts];
        this.nextMaxId = response.nextMaxId;
        this.moreAvailable = response.moreAvailable;
      })
    );
  }

  getMediaPosts(): IGMediaPostDTO[] {
    return this.mediaPosts;
  }

  clearMediaPosts(): void {
    this.mediaPosts = [];
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
