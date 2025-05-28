import { Component } from '@angular/core';
import { UsernameCheckService } from '../../../../services/backend/instagram/username-check.service';
import { OrderData, OrderDataService } from '../../../../services/order-data.service';
import { IgUserInfo } from '../../../../core/models/ig-user-info';
import { take } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Router, RouterLink } from '@angular/router';
import { ServicesService } from '../../../../services/backend/services/services.service';
import { PlatformNode, QuantityNode, ServiceNode } from '../../../../core/models/panel-nodes';

@Component({
  selector: 'app-order-details',
  imports: [
    RouterLink
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {

  userInfoValue!: IgUserInfo;
  orderData!: OrderData;
  product!: ServiceNode | null;
  quantity!: QuantityNode | null;

  isInstagram: boolean = false;

  constructor(
    private servicesService: ServicesService,
    private orderDataService: OrderDataService,
    private usernameCheckService: UsernameCheckService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.orderDataService.orderData$.pipe(take(1)).subscribe(data => {
      this.orderData = data;
      this.loadService();
      if (this.isInstagram) {
        this.usernameCheckService.checkIGUsername(this.orderData.username!).subscribe(res => {
          this.userInfoValue = res;
          console.log(this.userInfoValue.id);
          console.log(this.userInfoValue.username);
          console.log(this.userInfoValue.isPrivate);
          console.log(this.userInfoValue.profilePicUrl);
        });
      } else {
        console.log(this.orderData.platform);
      }
    });
  }

  ngOnDestroy() {
    const currentData = this.orderDataService.getSnapshot();
    this.orderDataService.setAll({
      ...currentData,
      username: null,
      mail: null,
      name: null,
      lastname: null,
      platform: null
    });
  }

  getImageUrl(): string {
    return environment.production
      ? environment.imgProxy + this.userInfoValue.profilePicUrl
      : '/dev_img.jpg';
  }

  loadService() {
    this.servicesService.getServices().subscribe(tree => {
      const platformGroup = tree[0];
      const foundService = platformGroup.children!.find(child => child.refId === this.orderData.serviceId);
      const serviceGroup = foundService?.children![0];
      const foundProduct = serviceGroup?.children!.find(child => child.refId === this.orderData.productId);
      const qualityGroup = foundProduct?.children![0];
      const foundQuality = qualityGroup?.children!.find(child => child.refId === this.orderData.qualityId);
      const quantityGroup = foundQuality?.children![0];
      const foundQuantity = quantityGroup?.children!.find(child => child.refId === this.orderData.quantityId);

      if (!foundService || !foundProduct || !foundQuality || !foundQuantity) {
        this.router.navigate(['/404']);
        return;
      }

      this.isInstagram = (foundService as PlatformNode).platform === "INSTAGRAM";
      this.product = foundProduct as ServiceNode;
      this.quantity = foundQuantity as QuantityNode;
    });
  }

}
