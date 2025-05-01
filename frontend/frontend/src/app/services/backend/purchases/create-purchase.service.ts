import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CartItem } from '../../../core/models/cart-item';
import { environment } from '../../../../environments/environment';

export interface PurchaseDTO {
  name: string;
  lastName: string;
  email: string;
  totalPrice: number;
  cartItems: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CreatePurchaseService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  create(purchase: PurchaseDTO): Observable<string> {
    const apiUrl = `${this.baseUrl}/api/purchases`;
    return this.http.post(apiUrl, purchase, { responseType: 'text' as const });
  }
}
