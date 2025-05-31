import { Component, inject, OnInit } from '@angular/core';
import { IgUserInfo } from '../../../core/models/ig-user-info';
import { CartService } from '../../../services/cart.service';
import { UserInfoService } from '../../../services/temporary/user-info.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IGMediaService } from '../../../services/backend/instagram/retrieve-media.service';

@Component({
  selector: 'app-profile-service',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-service.component.html',
  styleUrl: './profile-service.component.css'
})
export class ProfileServiceComponent {

  /*private router = inject(Router);
  private cartService = inject(CartService);
  private userinfoService = inject(UserInfoService);
  username!: string;
  serviceId!: number;
  quantity!: number;
  provider!: string;

  createPurchase() {
    if (this.username == null || this.serviceId == null || this.quantity == null || this.quantity < 10 || this.provider == null) 
      return;
    this.cartService.addItem(
      new CartItem(
        this.username,
        this.serviceId,
        "PROFILE SERVICE", 
        [this.username], 
        "PROFILE", 
        this.provider,
        this.quantity, 
        0,
        this.quantity,
        "quality_name",
        "undefined")
    );
    this.router.navigate(["/manual-processing"]);
  }

  ngOnInit(): void {
    this.userinfoService.username$.subscribe((value) => {
      this.username = value;
    });
  }
    */

}
