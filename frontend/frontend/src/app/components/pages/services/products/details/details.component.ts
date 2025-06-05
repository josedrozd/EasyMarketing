import { Component } from '@angular/core';
import { TreeNode } from '../../../../panel/tree-node/tree-node.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../../../../services/backend/services/services.service';
import { QualityNode, QuantityNode } from '../../../../../core/models/panel-nodes';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { OrderDataService } from '../../../../../services/order-data.service';

@Component({
  selector: 'app-details',
  imports: [
    CommonModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {

  serviceRef: string | null = null;
  productRef: string | null = null;
  product!: TreeNode;
  qualities!: TreeNode[];
  msg!: string;
  private productsSub!: Subscription;
  private orderSub!: Subscription;

  selectedTab: number = 0;
  selectedQuantity!: QuantityNode | null;

  constructor(
    private services: ServicesService,
    private orderDataService: OrderDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.orderSub = this.orderDataService.orderData$.subscribe(data => {
      this.serviceRef = data.serviceId;
      this.productRef = data.productId;
      if (this.serviceRef && this.productRef) {
        this.loadService(this.serviceRef, this.productRef);
      } else {
        this.router.navigate(['']);
      }
    });
  }

  ngOnDestroy() {
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }

  loadService(sref: string, dref: string) {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
    this.productsSub = this.services.getServices().subscribe(tree => {
      const platformGroup = tree[0];
      const foundService = platformGroup.children?.find(child => child.refId === sref);
      const serviceGroup = foundService?.children?.[0];
      const foundProduct = serviceGroup?.children?.find(child => child.refId === dref);
      if (!foundService || !foundProduct) {
        this.router.navigate(['/404']);
        return;
      }
      this.product = foundProduct;
      this.qualities = (foundProduct.children?.[0]?.children
          ?.filter(child => (child as QualityNode).activated)
          .sort((a, b) => (b as QualityNode).priority - (a as QualityNode).priority)) ?? [];
      this.setTab(0);
      this.msg = "Compra " + this.product.name + " con entrega inmediata.";
    });
  }

  setTab(index: number): void {
    this.selectedTab = index;

    const quality = this.qualities[index];
    const quantityGroup = quality.children?.find(child => child.nodeType === 'quantity-group');
    const firstQuantity = quantityGroup?.children?.[0];

    this.selectedQuantity = firstQuantity ? (firstQuantity as QuantityNode) : null;
  }

  isWithDiscount(quantity: any): boolean {
    return quantity.withDiscount === true;
  }

  getDiscount(quantity: any): string {
    return quantity.discount + '% OFF';
  }

  getType(product: any): string {
    return product.product;
  }
  
  selectQuantity(quantity: TreeNode) {
    this.selectedQuantity = quantity as QuantityNode;
  }

  buy() {
    const selectedQuality = this.qualities[this.selectedTab] as QualityNode;
    const selectedQuantity = this.selectedQuantity;
    if (selectedQuality && selectedQuantity) {
      this.orderDataService.setAll({
        qualityId: selectedQuality.refId,
        quantityId: selectedQuantity.refId
      });
      this.router.navigate(['/ordenes/ingresar-datos']);
    }
  }

  getQuantity(node: TreeNode): string {
    const quantity = (node as QuantityNode).quantity;
    if (quantity >= 1000) {
      return (quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1) + 'K';
    }
    return quantity.toString();
  }

  getSaving(node: TreeNode | null): string {
    return "Ahorras $" + ((node as QuantityNode).basePrice - (node as QuantityNode).finalPrice).toString();
  }

  getDescription(node: TreeNode): string {
    return (node as QualityNode).description || 'No hay descripción disponible.';
  }

  getTabClass(index: number): string {
    switch (index) {
      case 0:
        return 'tab-bg-1';
      case 1:
        return 'tab-bg-2';
      case 2:
        return 'tab-bg-3';
      default:
        return 'tab-bg-default';
    }
  }

  getCardClass(): string {
    switch (this.selectedTab) {
      case 0:
        return 'tab-bg-1';
      case 1:
        return 'tab-bg-2';
      case 2:
        return 'tab-bg-3';
      default:
        return 'tab-bg-default';
    }
  }

  getFontClass(): string {
    switch (this.selectedTab) {
      case 0:
        return 'font-1';
      case 1:
        return 'font-2';
      case 2:
        return 'font-3';
      default:
        return 'font-default';
    }
  }

  getTabBorderClass(): string {
    switch (this.selectedTab) {
      case 0:
        return 'border-tab-1';
      case 1:
        return 'border-tab-2';
      case 2:
        return 'border-tab-3';
      default:
        return 'border-tab-default';
    }
  }

  getSavingClass(): string {
    switch (this.selectedTab) {
      case 0:
        return 'saving-1';
      case 1:
        return 'saving-2';
      case 2:
        return 'saving-3';
      default:
        return 'saving-default';
    }
  }

}
