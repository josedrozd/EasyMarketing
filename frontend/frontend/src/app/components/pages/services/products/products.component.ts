import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../../../services/backend/services/services.service';
import { TreeNode } from '../../../panel/tree-node/tree-node.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {

  referenceId: string | null = null;
  service!: TreeNode;
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

}
