import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../core/models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartKey = 'cart';
  private readonly cartByOrdersKey = 'cartByOrders';

  private cart: CartItem[] = [];
  private cartByOrders: CartItem[][] = [];
  private cartByOrdersSubject = new BehaviorSubject<CartItem[][]>([]);

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const storedCart = localStorage.getItem(this.cartKey);
      const storedOrders = localStorage.getItem(this.cartByOrdersKey);

      this.cart = storedCart ? JSON.parse(storedCart) : [];
      this.cartByOrders = storedOrders ? JSON.parse(storedOrders) : [];
      this.cartByOrdersSubject.next(this.cartByOrders);
    }
  }

  getCartItems$() {
    return this.cartByOrdersSubject.asObservable();
  }

  getCartItems() {
    return this.cart;
  }

  addItem(item: CartItem) {
    this.cart.push(item);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  replaceCart(cart: CartItem[]) {
    this.cart = cart;
    this.saveCart();
  }

  getCartByOrders() {
    return this.cartByOrders;
  }

  addCartOrder(cart: CartItem[]) {
    this.cartByOrders.push(cart);
    this.cartByOrdersSubject.next(this.cartByOrders);
    this.saveCartByOrders();
  }

  clearCartByOrders() {
    this.cartByOrders = [];
    this.cartByOrdersSubject.next(this.cartByOrders);
    this.saveCartByOrders();
  }

  replaceCartByOrders(carts: CartItem[][]) {
    this.cartByOrders = carts;
    this.cartByOrdersSubject.next(this.cartByOrders);
    this.saveCartByOrders();
  }

  private saveCart() {
    if (this.isBrowser) {
      localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
    }
  }

  private saveCartByOrders() {
    if (this.isBrowser) {
      localStorage.setItem(this.cartByOrdersKey, JSON.stringify(this.cartByOrders));
    }
  }
}
