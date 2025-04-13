import { Component, inject, OnInit } from '@angular/core';
import { IgUserInfo } from '../../../core/models/ig-user-info';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../core/models/cart-item';
import { UserInfoService } from '../../../services/temporary/user-info.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-service',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-service.component.html',
  styleUrl: './profile-service.component.css'
})
export class ProfileServiceComponent implements OnInit{

  private router = inject(Router);
  private cartService = inject(CartService);
  private userinfoService = inject(UserInfoService);
  username!: string;
  serviceId!: number;
  quantity!: number;

  createPurchase() {
    if (this.serviceId == null || this.quantity == null || this.quantity < 10) 
      return;
    this.cartService.addItem(
      new CartItem(
        this.serviceId,
        "PROFILE SERVICE", 
        [this.username], 
        "PROFILE", 
        this.quantity, 
        0)
    );
    this.router.navigate(["/manual-processing"]);
  }

  ngOnInit(): void {
    this.userinfoService.username$.subscribe((value) => {
      this.username = value;
    });
  }

}
