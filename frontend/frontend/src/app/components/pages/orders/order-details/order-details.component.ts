import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { UsernameCheckService } from '../../../../services/backend/instagram/username-check.service';
import { OrderData, OrderDataService } from '../../../../services/order-data.service';
import { IgUserInfo } from '../../../../core/models/ig-user-info';
import { take } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Router, RouterLink } from '@angular/router';
import { ServicesService } from '../../../../services/backend/services/services.service';
import { PlatformNode, QuantityNode, ServiceNode } from '../../../../core/models/panel-nodes';
import { IGMediaPostDTO, IGMediaService } from '../../../../services/backend/instagram/retrieve-media.service';
import { IGClipsService, IGReelClipDTO } from '../../../../services/backend/instagram/retrieve-reels.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-order-details',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css', '../order-layout/order-layout.component.css']
})
export class OrderDetailsComponent {

  isLoading: boolean = true;
  isLoadingMedia: boolean = false;

  userInfoValue!: IgUserInfo;
  orderData!: OrderData;
  product!: ServiceNode | null;
  quantity!: QuantityNode | null;

  isInstagram: boolean = false;
  mediaVisible: boolean = false;

  userId!: number;
  profilePicUrl!: string;
  mediaType!: string;
  media: IGReelClipDTO[] | IGMediaPostDTO[] = [];
  selectedUrls: string[] = [];

  constructor(
    private servicesService: ServicesService,
    private orderDataService: OrderDataService,
    private usernameCheckService: UsernameCheckService,
    private igMediaService: IGMediaService,
    private igClipsService: IGClipsService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.orderDataService.orderData$.pipe(take(1)).subscribe(data => {
      this.orderData = data;
      this.loadService();
    });
    if (isPlatformBrowser(this.platformId))
      window.addEventListener('beforeunload', this.onPageUnload);
  }

  ngOnDestroy() {
    this.cleanupMedia();
    if (isPlatformBrowser(this.platformId))
      window.removeEventListener('beforeunload', this.onPageUnload);
  }

  onPageUnload = () => {
    this.cleanupMedia();
  }

  cleanupMedia() {
    this.igMediaService.clearMediaPosts();
    this.igClipsService.clearReelClips();
    this.selectedUrls = [];
  }

  getImageUrl(picUrl: string): string {
    return environment.production
      ? environment.imgProxy + picUrl
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
      this.mediaType = (foundProduct as ServiceNode).type;
      this.mediaVisible = this.isInstagram && (this.mediaType === "POST" || this.mediaType === "REEL");
      this.product = foundProduct as ServiceNode;
      this.quantity = foundQuantity as QuantityNode;
      if (this.isInstagram) this.loadIgData();
    });
  }

  loadIgData() {
    this.usernameCheckService.checkIGUsername(this.orderData.username!).subscribe(res => {
      this.userInfoValue = res;
      this.userId = Number(this.userInfoValue.id);
      this.loadMedia();
    });
  }

  loadMedia() {
    console.log("loading");
    if (this.mediaType === "POST") {
      this.isLoadingMedia = true;
      this.igMediaService.getMediaByUserId(this.userId).subscribe(() => {
        this.media = this.igMediaService.getMediaPosts();
        this.isLoading = false
        this.isLoadingMedia = false;
      });
    } else if (this.mediaType === "REEL") {
      this.isLoadingMedia = true;
      this.igClipsService.getReelsByUserId(this.userId).subscribe(() => {
        this.media = this.igClipsService.getReelClips();
        this.isLoading = false
        this.isLoadingMedia = false;
      });
    } else {
      this.isLoading = false
    }
  }

  toggleSelection(url: string) {
    const index = this.selectedUrls.indexOf(url);
    if (index !== -1) {
      this.selectedUrls.splice(index, 1);
    } else {
      this.selectedUrls.push(url);
    }
  }

  isSelected(url: string): boolean {
    return this.selectedUrls.indexOf(url) !== -1;
  }

  hasMore(): boolean {
    return this.mediaType && this.mediaType === "POST" ? this.igMediaService.hasMore() : this.igClipsService.hasMore();
  }

  addToCart() {
    const currentData = this.orderDataService.getSnapshot();
    this.orderDataService.setAll({
      ...currentData,
      serviceId: null,
      productId: null,
      qualityId: null,
      quantityId: null
    });
  }

  isDisabled(): boolean {
    return !(["POST", "REEL"].includes(this.mediaType) && this.selectedUrls.length !== 0);
  }

}
