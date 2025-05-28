import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { ServicesService } from '../../../services/backend/services/services.service';
import { Observable } from 'rxjs';
import { TreeNode } from '../../panel/tree-node/tree-node.component';
import { CommonModule } from '@angular/common';
import { ExtraNode } from '../../../core/models/panel-nodes';
import { Router } from '@angular/router';
import { OrderDataService } from '../../../services/order-data.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule
    ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {

  servicios$!: Observable<TreeNode[]>;
  servicesList: TreeNode[] = [];

  constructor(
    private services: ServicesService,
    private orderDataService: OrderDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.servicios$ = this.services.getServices();
    this.servicios$.subscribe(tree => {
      this.servicesList = tree.flatMap(node => node.children ?? []).filter(child => (child as any).active);
    });
  }

  redirectToService(node: TreeNode) {
    if (node.nodeType == "extra") {
      window.location.href = (node as ExtraNode).destinationUrl;
    } else {
      this.orderDataService.setServiceRefId(node.refId);
      this.router.navigate(['/servicios', this.slugify(node.name), 'productos']);
    }
  }

  slugify(text: string) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  }

}
