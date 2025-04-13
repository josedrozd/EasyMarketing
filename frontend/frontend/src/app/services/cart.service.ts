import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CartItem } from '../core/models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: CartItem[] = [];

  getCartItems(){
    return this.cart;
  }

  addItem(item: CartItem){
    this.cart.push(item);
  }

  clearCart(){
    this.cart = [];
  }

  replaceCart(cart: CartItem[]){
    this.cart = cart;
  }

}
