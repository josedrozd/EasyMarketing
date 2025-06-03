import { Component, ElementRef, Inject, PLATFORM_ID, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { UsernameCheckService } from '../../../../services/backend/instagram/username-check.service';
import { OrderData, OrderDataService } from '../../../../services/order-data.service';
import { IgUserInfo } from '../../../../core/models/ig-user-info';
import { take } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Router, RouterLink } from '@angular/router';
import { ServicesService } from '../../../../services/backend/services/services.service';
import { PlatformNode, QualityNode, QuantityNode, ServiceNode } from '../../../../core/models/panel-nodes';
import { IGMediaPostDTO, IGMediaService } from '../../../../services/backend/instagram/retrieve-media.service';
import { IGClipsService, IGReelClipDTO } from '../../../../services/backend/instagram/retrieve-reels.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../../core/models/cart-item';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-order-details',
  imports: [
    MatSlideToggleModule,
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css', '../order-layout/order-layout.component.css']
})
export class OrderDetailsComponent {

  isLoading: boolean = true;
  isLoadingMedia: boolean = false;

  userInfoValue!: IgUserInfo;
  orderData!: OrderData;
  platform!: PlatformNode | null;
  product!: ServiceNode | null;
  quality!: QualityNode | null;
  quantity!: QuantityNode | null;

  isInstagram: boolean = false;
  mediaVisible: boolean = false;
  
  isAutoDistribution: boolean = true;

  userId!: number;
  profilePicUrl!: string | undefined;
  mediaType!: string;
  media: IGReelClipDTO[] | IGMediaPostDTO[] = [];
  selectedUrls: string[] = [];
  
  @ViewChildren('manualQtyInput') manualInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private cartService: CartService,
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

  getImageUrl(picUrl: string | undefined): string {
    return picUrl && environment.production && this.isInstagram
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
      this.platform = foundService as PlatformNode;
      this.product = foundProduct as ServiceNode;
      this.quality = foundQuality as QualityNode;
      this.quantity = foundQuantity as QuantityNode;
      if (this.isInstagram) this.loadIgData();
      else this.isLoading = false;
    });
  }

  loadIgData() {
    this.usernameCheckService.checkIGUsername(this.orderData.username!).subscribe(res => {
      this.userInfoValue = res;
      this.userId = Number(this.userInfoValue.id);
      this.profilePicUrl = this.userInfoValue.profilePicUrl;
      this.loadMedia();
    });
  }

  loadMedia() {
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

  isDisabled(): boolean {
    return this.isInstagram && ["POST", "REEL"].includes(this.mediaType) && this.selectedUrls.length === 0;
  }

  getAutoDistributedValue(): number {
    if (!this.quantity || !this.quantity.quantity) return 0;
    const selectedCount = this.selectedUrls.length || 1;
    return Math.floor(this.quantity.quantity / selectedCount);
  }

  addToCart() {
    const itemsToAdd: CartItem[] = [];
    if(["POST", "REEL"].includes(this.mediaType)){
      if (this.isAutoDistribution) {
        const distributedQty = this.getAutoDistributedValue();
        const item = new CartItem(
          this.orderData.username!,
          this.platform?.id!,
          this.product?.id!,
          this.quality?.id!,
          this.quantity?.id!,
          [...this.selectedUrls],
          distributedQty
        );
        itemsToAdd.push(item);
      } else {
        const manualQtyMap = new Map<string, number>();
        this.manualInputs.forEach(inputRef => {
          const url = inputRef.nativeElement.getAttribute('data-url');
          const value = parseFloat(inputRef.nativeElement.value);
          if (url && !isNaN(value)) {
            manualQtyMap.set(url, value);
          }
        });
        for (const url of this.selectedUrls) {
          const qty = manualQtyMap.get(url) ?? 0;
          const item = new CartItem(
            this.orderData.username!,
            this.platform?.id!,
            this.product?.id!,
            this.quality?.id!,
            this.quantity?.id!,
            [url],
            qty
          );
          itemsToAdd.push(item);
        }
      }
    } else {
      itemsToAdd.push(new CartItem(
          this.orderData.username!,
          this.platform?.id!,
          this.product?.id!,
          this.quality?.id!,
          this.quantity?.id!,
          [this.orderData.username!],
          this.quantity?.quantity!
      ));
    }
    if(this.validateItems(itemsToAdd)) {
      this.cartService.addCartOrder(itemsToAdd);
      console.log(itemsToAdd);
      this.router.navigate(['/carrito']);
    }
  }

  private validateItems(items: CartItem[]): boolean {
    let total = 0;
    for (const item of items) {
      if (
        item.username == null ||
        item.platformId == null ||
        item.productId == null ||
        item.qualityId == null ||
        item.quantityId == null ||
        item.unitQuantity == null
      ) {
        alert('Hubo un error al cargar los datos, por favor vuelva a generar la compra.');
        this.router.navigate(['/']);
        return false;
      }
      if (!Number.isInteger(item.unitQuantity)) {
        alert('Las cantidades deben ser números enteros.');
        return false;
      }
      if (this.platform?.automaticPaymentAllowed && this.quality?.automaticPayment){
        if (item.unitQuantity < this.quality!.minimum) {
          alert(`La cantidad minima permitida es de ${this.quality!.minimum}.`);
          return false;
        }
      } else if (item.unitQuantity < 10) {
          alert(`La cantidad minima permitida es de 10.`);
          return false;
      }
      total += item.unitQuantity;
      if (total > this.quantity!.quantity) {
        alert(`La suma total excede el máximo permitido de ${this.quantity!.quantity}.`);
        return false;
      }
    }
    return true;
  }



}
