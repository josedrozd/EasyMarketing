import { Component } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../../core/models/cart-item';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartItemData } from '../../../core/models/cart-item-data';
import { OrderData, OrderDataService } from '../../../services/order-data.service';
import { take } from 'rxjs';
import { MpPreferenceService, PreferenceDTO, PurchaseDTO } from '../../../services/backend/mp/mp-preference.service';

@Component({
  selector: 'app-cart',
  imports: [
    RouterLink,
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css', '../main/main.component.css']
})
export class CartComponent {

  isLoading: boolean = true;
  cartItems: CartItem[][] = [];
  cartItemsData: CartItemData[] = [];
  orderData!: OrderData;
  total!: number;
  creatingPurchase: boolean = false;
  preference!: PreferenceDTO;

  constructor(
      private cartService: CartService,
      private orderDataService: OrderDataService,
      private createPurchaseService: MpPreferenceService,
      private router: Router
  ) {
  }

  ngOnInit() {
    this.cartService.cartItemsData$.subscribe(data => {
      this.cartItemsData = data;
      this.updateTotal();
      this.orderDataService.orderData$.pipe(take(1)).subscribe(data => {
        this.orderData = data;
        this.cartItems = this.cartService.getCartByOrders();
        this.isLoading = false;
      })
    });
  }

  removeItem(index: number) {
    this.cartService.removeCartItemByOrderIndex(index);
    this.updateTotal();
  }

  updateTotal() {
    this.total = this.cartItemsData.reduce((sum, item) =>
      sum + (item.quantity.withDiscount ? item.quantity.finalPrice : item.quantity.basePrice), 0);
  }

  createPurchase() {
    this.creatingPurchase = true;
    const purchase: PurchaseDTO = {
      email: this.orderData.mail!,
      name: this.orderData.name!,
      lastName: this.orderData.lastname!,
      cartItems: this.cartItems
    };
    this.createPurchaseService.createPreference(purchase).subscribe(res => {
      this.preference = res;
      this.creatingPurchase = false;
      this.router.navigate(['/compras/metodos-de-pago']);
    });
  }

}
