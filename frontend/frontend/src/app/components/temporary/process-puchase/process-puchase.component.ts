import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { CartItem } from '../../../core/models/cart-item';
import { CartService } from '../../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { CreatePurchaseService } from '../../../services/backend/purchases/create-purchase.service';
import { FailedCartItemDTO, ProcessPurchaseService, PurchaseProcessData } from '../../../services/backend/purchases/process-purchase.service';
import { PurchaseDTO } from '../../../services/backend/purchases/create-purchase.service';
import { CheckPasswordService } from '../../../services/backend/security/check-password.service';

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
  purchaseId!: number | null;
  
  constructor(
    private checkPassword: CheckPasswordService,
    private cartService: CartService,
    private createPurchase: CreatePurchaseService,
    private processPurchase: ProcessPurchaseService,
    private router: Router,
    private transferState: TransferState
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const authPassed = localStorage.getItem('auth_passed') === 'true';
      if (!authPassed) {
        const pass = prompt('Contraseña:');
        this.checkPassword.checkPassword(pass!).subscribe({
          next: (result) => {
            if (result) {
              localStorage.setItem('auth_passed', 'true');
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
  }
  
  procesarCarrito(){
    console.log("Purchase id: " + this.purchaseId);
    if(!this.purchaseId){
      this.createPurchase.create({
        email: "testing@mail.com",
        totalPrice: 0,
        cartItems: this.cartItems
      }).subscribe({
        next: (response) => {
          this.purchaseId = response;
          this.procesarCompra(this.purchaseId);
        },
        error: (err) => {
          console.error('Error creating purchase: ', err);
        }
      });
    } else {
      this.procesarCompra(this.purchaseId);
    }
  }

  procesarCompra(id: number){
    this.processPurchase.process(id).subscribe(
      {
        next: (response: PurchaseProcessData) => {
          if(!response || !response.completed){
            this.cartService.replaceCart(this.convertFailedItemsToCartItems(response.failedItems));
            alert("Hubo problemas al procesar algunos de los servicios. Vuelva a hacer click en procesar.");
          } else {
            this.vaciarCarrito();
            alert("La compra fue procesada.");
          }},
        error: (err) => {
          alert("Error al procesar la compra.");
          console.log("Error al procesar la compra: " + this.purchaseId);
        }
      }
    );
  }

  vaciarCarrito() {
    this.cartService.clearCart();
    this.cartItems = this.cartService.getCartItems();
    this.purchaseId = null;
  }

  convertFailedItemsToCartItems(failedItems: FailedCartItemDTO[]): CartItem[] {
    return failedItems.map(failedItem => {
      const cartItem = new CartItem(
        failedItem.serviceId,
        "SERVICE",
        [failedItem.url],
        "",
        failedItem.quantity,
        0
      );  
      return cartItem;
    });
  }

}
