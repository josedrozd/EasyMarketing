import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { CartItem } from '../../../core/models/cart-item';
import { CartService } from '../../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { CreatePurchaseService } from '../../../services/backend/purchases/create-purchase.service';
import { FailedCartItemDTO, ProcessPurchaseService, PurchaseProcessData } from '../../../services/backend/purchases/process-purchase.service';
import { CheckPasswordService } from '../../../services/backend/security/check-password.service';
import { UserInfoService } from '../../../services/temporary/user-info.service';
import { firstValueFrom } from 'rxjs';

const AUTH_KEY = makeStateKey<boolean>('auth');

@Component({
  selector: 'app-process-puchase',
  imports: [CommonModule, RouterModule],
  templateUrl: './process-puchase.component.html',
  styleUrl: './process-puchase.component.css'
})
export class ProcessPuchaseComponent {

  private platformId = inject(PLATFORM_ID);
  processData!: PurchaseProcessData;
  cartItems: CartItem[] = [];
  visible: boolean = false;
  username!: string;
  processing: boolean = false;

  constructor(
    private userinfoService: UserInfoService,
    private checkPassword: CheckPasswordService,
    private cartService: CartService,
    private createPurchase: CreatePurchaseService,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const authPassed = sessionStorage.getItem('auth_passed') === 'true';
      if (!authPassed) {
        const pass = prompt('Contraseña:');
        this.checkPassword.checkPassword(pass!).subscribe({
          next: (result) => {
            if (result) {
              sessionStorage.setItem('auth_passed', 'true');
              this.visible = true;
            } else {
              alert('Acceso denegado');
              this.router.navigate(['/404']);
            }
          }
        })
      } else {
        this.visible = true;
      }
    }
  }

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    this.userinfoService.username$.subscribe((value) => {
      this.username = value;
    });
  }

  async procesarCarrito(): Promise<void> {
    if(this.cartItems.length <= 0) {
      alert("La compra debe tener al menos un servicio.")
      return;
    }
    this.processing = true;
    try {
      await this.crearCompra();
    } finally {
      this.processing = false;
    }
  }

  private async crearCompra(): Promise<void> {
    try {
      const token = await firstValueFrom(
        this.createPurchase.create({
          name: 'Pepe',
          lastName: 'Argento',
          email: 'drozd.jose@gmail.com',
          totalPrice: 0,
          cartItems: this.cartItems,
        })
      );
      if(token){
        console.log(token)
        this.vaciarCarrito();
        this.router.navigate(['/process-purchase'], { queryParams: { external_reference: token, payment_id: 1 } });
      } else {
        alert('Error al crear la compra.');
      }
    } catch (error) {
      console.error('Error al crear la compra:', error);
    }
  }

  vaciarCarrito() {
    this.cartService.clearCart();
    this.cartItems = this.cartService.getCartItems();
  }

  convertFailedItemsToCartItems(failedItems: FailedCartItemDTO[]): CartItem[] {
    return failedItems.map(failedItem => {
      const cartItem = new CartItem(
        failedItem.username,
        failedItem.serviceId,
        "SERVICE",
        [failedItem.url],
        "",
        failedItem.provider,
        failedItem.quantity,
        0
      );
      return cartItem;
    });
  }

}
