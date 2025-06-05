import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { OrderData, OrderDataService } from '../../../../services/order-data.service';
import { ServicesService } from '../../../../services/backend/services/services.service';
import { Observable } from 'rxjs';
import { TreeNode } from '../../../panel/tree-node/tree-node.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    MatIconModule
  ],
  templateUrl: './order-layout.component.html',
  styleUrl: './order-layout.component.css'
})
export class OrderLayoutComponent {

  progressWidth = '0%';

  constructor(
    private router: Router,
    private orderDataService: OrderDataService,
    private servicesService: ServicesService
  ) {
    this.router.events.subscribe(() => {
      this.setProgressBar();
    });
    this.setProgressBar();
  }

  setProgressBar() {
    const url = this.router.url;
    if (url === '/ordenes/ingresar-datos') {
      this.progressWidth = '50%';
    } else if (url === '/ordenes/detalles') {
      this.progressWidth = '100%';
    } else {
      this.progressWidth = '0%';
    }
  }

  goBack() {
    const currentUrl = this.router.url;

    if (currentUrl === '/ordenes/ingresar-datos') {
      const orderData: OrderData = this.orderDataService.getSnapshot();
      this.servicesService.getServices().subscribe(tree => {
        const platformGroup = tree[0];
        const foundService = platformGroup.children!.find(child => child.refId === orderData.serviceId);
        const serviceGroup = foundService!.children![0];
        const foundProduct = serviceGroup.children!.find(child => child.refId === orderData.productId);

        if (!foundService || !foundProduct) {
          this.router.navigate(['/404']);
          return;
        }

        this.router.navigate(['/servicios/'+this.slugify(foundService.name)+'/productos/'+this.slugify(foundProduct.name)+'/detalles']);
      });
    } else if (currentUrl === '/ordenes/detalles') {
      const currentData = this.orderDataService.getSnapshot();
      this.orderDataService.setAll({
        serviceId: currentData.serviceId,
        productId: currentData.productId,
        qualityId: currentData.qualityId,
        quantityId: currentData.quantityId,
        username: null
      });
      this.router.navigate(['/ordenes/ingresar-datos']);
    } else {
      this.orderDataService.reset();
      this.router.navigate(['/']);
    }
  }

  goIndex() {
    this.orderDataService.setAll({
        username: null
    });
    this.router.navigate(['/']);
  }

  slugify(text: string) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  }

}
