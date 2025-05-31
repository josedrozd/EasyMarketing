import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IGMediaPostDTO, IGMediaService } from '../../../services/backend/instagram/retrieve-media.service';
import { UserInfoService } from '../../../services/temporary/user-info.service';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-post-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-service.component.html',
  styleUrl: './post-service.component.css'
})
export class PostServiceComponent {
  
  /*private router = inject(Router);
  private userinfoService = inject(UserInfoService);
  private cartService = inject(CartService);
  userId!: number;
  mediaPosts: IGMediaPostDTO[] = [];
  selectedUrls: string[] = [];
  serviceId!: number;
  quantity!: number;
  provider!: string;
  username!: string;

  constructor(private igMediaService: IGMediaService) {}

  ngOnInit() {
    this.userinfoService.userId$.subscribe((value) => {
      console.log("updating with: "+value);
      if(value) this.userId = Number(value);
    });
    this.userinfoService.username$.subscribe((value) => {
      this.username = value;
    });
    this.loadMedia();
  }

  loadMedia() {
    this.igMediaService.getMediaByUserId(this.userId).subscribe(() => {
      this.mediaPosts = this.igMediaService.getMediaPosts();
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
    return this.igMediaService.hasMore();
  }

  createPurchase(){
    if (this.username == null || this.serviceId == null || this.quantity == null || this.quantity < 10 || this.provider == null || this.selectedUrls.length == 0) 
          return;
    console.log("POST username: "+ this.username);
    this.cartService.addItem(
      new CartItem(
        this.username,
        this.serviceId,
        "POST SERVICE",
        this.selectedUrls, 
        "POST",
        this.provider,
        this.quantity, 
        0,
        this.quantity,
        "quality_name",
        "undefined")
    );
    this.router.navigate(["/manual-processing"]);
  }

  getImageUrl(picUrl: string): string {
    return environment.imgProxy+picUrl;
  }

  ngOnDestroy() {
    this.igMediaService.clearMediaPosts();
    this.selectedUrls = [];
  }

  */
}
