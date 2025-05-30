import { Injectable } from '@angular/core';
import { CartItem } from '../core/models/cart-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: CartItem[] = [];
  private cartByOrders: CartItem[][] = [];
  private cartByOrdersSubject = new BehaviorSubject<CartItem[][]>(this.cartByOrders);

  getCartItems$() {
    return this.cartByOrdersSubject.asObservable();
  }

  getCartItems() {
    return this.cart;
  }

  addItem(item: CartItem) {
    this.cart.push(item);
  }

  clearCart() {
    this.cart = [];
  }

  replaceCart(cart: CartItem[]) {
    this.cart = cart;
  }

  getCartByOrders() {
    return this.cartByOrders;
  }

  addCartOrder(cart: CartItem[]) {
    this.cartByOrders.push(cart);
    this.cartByOrdersSubject.next(this.cartByOrders);
  }

  clearCartByOrders() {
    this.cartByOrders = [];
    this.cartByOrdersSubject.next(this.cartByOrders);
  }

  replaceCartByOrders(carts: CartItem[][]) {
    this.cartByOrders = carts;
    this.cartByOrdersSubject.next(this.cartByOrders);
  }
  
}
