import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../core/models/cart-item';
import { ServicesService } from './backend/services/services.service';
import { CartItemData } from '../core/models/cart-item-data';
import { PlatformNode, QualityNode, QuantityNode, ServiceNode } from '../core/models/panel-nodes';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartKey = 'cart';
  private readonly cartByOrdersKey = 'cartByOrders';

  private cart: CartItem[] = [];
  private cartByOrders: CartItem[][] = [];
  private cartByOrdersSubject = new BehaviorSubject<CartItem[][]>([]);
  private cartItemsDataSubject = new BehaviorSubject<CartItemData[]>([]);

  cartItemsData$ = this.cartItemsDataSubject.asObservable();

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private servicesService: ServicesService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const storedCart = localStorage.getItem(this.cartKey);
      const storedOrders = localStorage.getItem(this.cartByOrdersKey);

      this.cart = storedCart ? JSON.parse(storedCart) : [];
      this.cartByOrders = storedOrders ? JSON.parse(storedOrders) : [];
      this.cartByOrdersSubject.next(this.cartByOrders);
      this.updateCartItemsData();
    }
  }

  private updateCartItemsData() {
    this.servicesService.getServices().subscribe(tree => {
      const data: CartItemData[] = [];

      this.cartByOrders.forEach(cartItem => {
        const platformGroup = tree[0];
        const foundService = platformGroup.children!.find(child => child.id === cartItem[0].platformId);
        const serviceGroup = foundService?.children![0];
        const foundProduct = serviceGroup?.children!.find(child => child.id === cartItem[0].productId);
        const qualityGroup = foundProduct?.children![0];
        const foundQuality = qualityGroup?.children!.find(child => child.id === cartItem[0].qualityId);
        const quantityGroup = foundQuality?.children![0];
        const foundQuantity = quantityGroup?.children!.find(child => child.id === cartItem[0].quantityId);

        if (foundService && foundProduct && foundQuality && foundQuantity) {
          data.push(new CartItemData(
            cartItem[0].username,
            foundService as PlatformNode,
            foundProduct as ServiceNode,
            foundQuality as QualityNode,
            foundQuantity as QuantityNode
          ));
        }
      });

      this.cartItemsDataSubject.next(data);
    });
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
    this.updateCartItemsData();
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
    this.updateCartItemsData();
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

  removeCartItemByOrderIndex(index: number) {
  if (index >= 0 && index < this.cartByOrders.length) {
    this.cartByOrders.splice(index, 1);
    this.cartByOrdersSubject.next(this.cartByOrders);
    this.saveCartByOrders();
    this.updateCartItemsData();
  }
}
}
