import { Component } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { ServicesService } from '../../../services/backend/services/services.service';
import { CartItem } from '../../../core/models/cart-item';
import { PlatformNode, QualityNode, QuantityNode, ServiceNode } from '../../../core/models/panel-nodes';
import { CommonModule } from '@angular/common';

export class CartItemData {
    platform!: PlatformNode;
    product!: ServiceNode;
    quality!: QualityNode;
    quantity!: QuantityNode;
    constructor(
      platform: PlatformNode,
      product: ServiceNode,
      quality: QualityNode,
      quantity: QuantityNode
    ){
      this.platform = platform;
      this.product = product;
      this.quality = quality;
      this.quantity = quantity;
    }
}

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  isLoading: boolean = true;
  cartItems: CartItem[][] = [];
  cartItemsData: CartItemData[] = [];

  constructor(
      private cartService: CartService,
      private servicesService: ServicesService,
      private router: Router
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.cartService.getCartItems$().subscribe(res => {
      this.cartItems = res;
      this.loadService();
    });
  }

  loadService() {
    this.cartItems.forEach(cartItem => {
      this.servicesService.getServices().subscribe(tree => {
        const platformGroup = tree[0];
        const foundService = platformGroup.children!.find(child => child.id === cartItem[0].platformId);
        const serviceGroup = foundService?.children![0];
        const foundProduct = serviceGroup?.children!.find(child => child.id === cartItem[0].productId);
        const qualityGroup = foundProduct?.children![0];
        const foundQuality = qualityGroup?.children!.find(child => child.id === cartItem[0].qualityId);
        const quantityGroup = foundQuality?.children![0];
        const foundQuantity = quantityGroup?.children!.find(child => child.id === cartItem[0].quantityId);

        if (!foundService || !foundProduct || !foundQuality || !foundQuantity) {
          this.router.navigate(['/404']);
          return;
        }
        
        this.cartItemsData.push(new CartItemData(
          foundService as PlatformNode,
          foundProduct as ServiceNode,
          foundQuality as QualityNode,
          foundQuantity as QuantityNode
        ))
      });
      this.isLoading = false;
    });
  }

}
