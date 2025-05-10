import { Component, inject } from '@angular/core';
import { UserInfoService } from '../../../services/temporary/user-info.service';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../core/models/cart-item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IGClipsService, IGReelClipDTO } from '../../../services/backend/instagram/retrieve-reels.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reel-service',
  imports: [CommonModule, FormsModule],
  templateUrl: './reel-service.component.html',
  styleUrl: './reel-service.component.css'
})
export class ReelServiceComponent {

  private router = inject(Router);
  private userinfoService = inject(UserInfoService);
  private cartService = inject(CartService);
  userId!: number;
  reelClips: IGReelClipDTO[] = [];
  selectedUrls: string[] = [];
  serviceId!: number;
  quantity!: number;
  provider!: string;
  username!: string;

  constructor(private igClipsService: IGClipsService) {}

  ngOnInit() {
    this.userinfoService.userId$.subscribe((value) => {
      console.log("updating with: "+value);
      if(value) this.userId = Number(value);
    });
    this.userinfoService.username$.subscribe((value) => {
      this.username = value;
    });
    this.loadClips();
  }

  loadClips() {
    this.igClipsService.getReelsByUserId(this.userId).subscribe(() => {
      this.reelClips = this.igClipsService.getReelClips();
    });
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
    return this.igClipsService.hasMore();
  }

  createPurchase(){
    if (this.username == null || this.serviceId == null || this.quantity == null || this.quantity < 10 || this.provider == null || this.selectedUrls.length == 0) 
          return;
    console.log("REEL username: "+ this.username);
    this.cartService.addItem(
      new CartItem(
        this.username,
        this.serviceId,
        "REEL SERVICE",
        this.selectedUrls, 
        "REEL",
        this.provider,
        this.quantity, 
        0)
    );
    this.router.navigate(["/manual-processing"]);
  }

  getImageUrl(picUrl: string): string {
    return `https://marketingfacil.com.ar/proxy/`+picUrl;
  }

  ngOnDestroy() {
    this.igClipsService.clearReelClips();
    this.selectedUrls = [];
  }

}
