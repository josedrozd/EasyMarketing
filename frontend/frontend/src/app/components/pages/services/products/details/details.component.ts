import { Component } from '@angular/core';
import { TreeNode } from '../../../../panel/tree-node/tree-node.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../../../../services/backend/services/services.service';
import { QualityNode, QuantityNode } from '../../../../../core/models/panel-nodes';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

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
  qualityRef: string | null = null;
  product!: TreeNode;
  qualities!: TreeNode[];
  msg!: string;
  private routeSub!: Subscription;
  private productsSub!: Subscription;

  selectedTab: number = 0;
  selectedQuantity!: QuantityNode | null;

  constructor(
    private services: ServicesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.serviceRef = params.get('sref');
      this.qualityRef = params.get('dref');
      if (this.serviceRef && this.qualityRef) {
        this.loadService(this.serviceRef, this.qualityRef);
      } else {
        this.router.navigate(['/404']);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
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
      const platformGroup = tree.find(node => node.nodeType === 'platform-group');
      if (!platformGroup || !platformGroup.children) {
        this.router.navigate(['/404']);
        return;
      }
      const foundService = platformGroup.children.find(child => child.id === sref);
      if (!foundService || !foundService.children) {
        this.router.navigate(['/404']);
        return;
      }
      const serviceGroup = foundService.children.find(node => node.nodeType === 'service-group');
      if (!serviceGroup || !serviceGroup.children) {
        this.router.navigate(['/404']);
        return;
      }
      const foundProduct = serviceGroup.children.find(child => child.id === dref);
      if (!foundProduct || !foundProduct.children) {
        this.router.navigate(['/404']);
        return;
      }
      this.product = foundProduct;
      this.qualities = (this.product?.children?.length ? 
        this.product.children[0].children?.filter(child => (child as QualityNode).activated).sort((a, b) => (b as QualityNode).priority - (a as QualityNode).priority) : []) ?? [];
      this.setTab(0);
      this.msg = "Compra " + this.product.name + " con entrega inmediata.";
    });
  }

  setTab(index: number): void {
    this.selectedTab = index;

    const quality = this.qualities[index];
    const quantityGroup = quality.children?.find(child => child.nodeType === 'quantity-group');
    const firstQuantity = quantityGroup?.children?.[0];

    this.selectedQuantity = firstQuantity as QuantityNode ?? null;
  }

  isWithDiscount(quantity: any): boolean {
    return quantity.withDiscount === true;
  }

  getDiscount(quantity: any): string {
    return quantity.discount + '% OFF';
  }
  
  selectQuantity(quantity: TreeNode) {
    this.selectedQuantity = quantity as QuantityNode;
  }

  buy() {
    console.log("buying");
  }

  getQuantity(node: TreeNode): string {
    const quantity = (node as QuantityNode).quantity;
    if (quantity >= 1000) {
      return (quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1) + 'K';
    }
    return quantity.toString();
  }

}
