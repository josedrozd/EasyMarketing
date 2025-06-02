import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CartItem } from '../../../core/models/cart-item';

export interface PurchaseDTO {
  name: string;
  lastName: string;
  email: string;
  cartItems: CartItem[][];
}

export interface PreferenceDTO {
  preferenceId: string;
  purchaseToken: string;
  accessToken: string;
  publicKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class MpPreferenceService {
  
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/api/mp/preferences/create`;

  private preferenceSubject = new ReplaySubject<PreferenceDTO>(1);
  public preference$ = this.preferenceSubject.asObservable();

  constructor(private http: HttpClient) {}

  createPreference(purchase: PurchaseDTO): Observable<PreferenceDTO> {
    return this.http.post<PreferenceDTO>(this.apiUrl, purchase).pipe(
      tap(preference => this.preferenceSubject.next(preference))
    );
  }

}
