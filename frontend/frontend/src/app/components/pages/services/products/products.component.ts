import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../../../services/backend/services/services.service';
import { TreeNode } from '../../../panel/tree-node/tree-node.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ServiceNode } from '../../../../core/models/panel-nodes';

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
  private routeSub!: Subscription;
  private servicesSub!: Subscription;

  constructor(
    private services: ServicesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeSub = this.route.queryParamMap.subscribe(params => {
      this.referenceId = params.get('reference');
      if (this.referenceId) {
        this.loadService(this.referenceId);
      } else {
        this.router.navigate(['/404']);
      }
    });
  }

  loadService(referenceId: string) {
    if (this.servicesSub) {
      this.servicesSub.unsubscribe();
    }
    this.servicesSub = this.services.getServices().subscribe(tree => {
      const platformGroup = tree.find(node => node.nodeType === 'platform-group');
      if (!platformGroup || !platformGroup.children) {
        this.router.navigate(['/404']);
        return;
      }
      const foundService = platformGroup.children.find(child => child.id === referenceId);
      if (!foundService) {
        this.router.navigate(['/404']);
        return;
      }
      this.service = foundService;
      this.products = (this.service?.children?.length ? 
        this.service.children[0].children?.filter(child => (child as ServiceNode).activated) : []) ?? [];
      this.msg = "Productos de " + this.service.name;
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.servicesSub) {
      this.servicesSub.unsubscribe();
    }
  }

  redirectToProduct(node: TreeNode) {
    console.log("redirect to:"+ node.name);
    this.router.navigate(
      ['/servicios', this.slugify(this.service.name), 'productos', this.slugify(node.name), 'detalles'], 
      { queryParams: { sref: this.service.id,  dref: node.id}});
  }

  slugify(text: string) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  }

}
