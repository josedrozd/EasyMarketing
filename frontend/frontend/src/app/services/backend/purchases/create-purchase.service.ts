import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IgUserInfo } from '../../../core/models/ig-user-info';
import { CartItem } from '../../../core/models/cart-item';

export interface PurchaseDTO {
  username: string;
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

  constructor(private http: HttpClient) {}

  create(purchase: PurchaseDTO): Observable<number> {
    const apiUrl = `/purchases`;
    return this.http.post<number>(apiUrl, purchase);
  }
}
