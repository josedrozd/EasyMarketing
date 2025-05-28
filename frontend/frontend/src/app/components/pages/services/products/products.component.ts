import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../../../services/backend/services/services.service';
import { TreeNode } from '../../../panel/tree-node/tree-node.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ServiceNode } from '../../../../core/models/panel-nodes';
import { OrderDataService } from '../../../../services/order-data.service';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {

  referenceId: string | null = null;
  service!: TreeNode;
  products!: TreeNode[];
  msg!: string;
  private servicesSub!: Subscription;
  private serviceIdSub!: Subscription;

  constructor(
    private services: ServicesService,
    private orderDataService: OrderDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.serviceIdSub = this.orderDataService.orderData$.subscribe(data => {
      const serviceId = data.serviceId;
      if (serviceId) {
        this.loadService(serviceId);
      } else {
        this.router.navigate(['']);
      }
    });
  }

  loadService(referenceId: string) {
    if (this.servicesSub) {
      this.servicesSub.unsubscribe();
    }
    this.servicesSub = this.services.getServices().subscribe(tree => {
      const platformGroup = tree[0];
      const foundService = platformGroup.children?.find(child => child.refId === referenceId);
      if (!foundService) {
        this.router.navigate(['/404']);
        return;
      }
      this.service = foundService;
      this.products = (foundService.children?.[0]?.children
          ?.filter(child => (child as ServiceNode).activated)) ?? [];
      this.msg = "Productos de " + foundService.name;
    });
  }

  ngOnDestroy() {
    if (this.servicesSub) {
      this.servicesSub.unsubscribe();
    }
  }

  redirectToProduct(node: TreeNode) {
    this.orderDataService.setProductRefId(node.refId);
    this.router.navigate(
      ['/servicios', this.slugify(this.service.name), 'productos', this.slugify(node.name), 'detalles']);
  }

  slugify(text: string) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  }

}
