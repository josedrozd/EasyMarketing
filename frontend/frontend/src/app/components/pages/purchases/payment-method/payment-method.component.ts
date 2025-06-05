import { Component, Injector, PLATFORM_ID } from '@angular/core';
import { MpPreferenceService, PreferenceDTO } from '../../../../services/backend/mp/mp-preference.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { filter, take } from 'rxjs';
import { CartService } from '../../../../services/cart.service';
import { CartItemData } from '../../../../core/models/cart-item-data';
import { OrderData, OrderDataService } from '../../../../services/order-data.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css', '../purchase-layout/purchase-layout.component.css']
})
export class PaymentMethodComponent {

  platformId: Object;
  isLoading: boolean = true;
  total!: number;
  selectedPayment!: string;
  isHoveringMp: boolean = false;
  hoverX: number = 0;
  hoverY: number = 0;
  preference!: PreferenceDTO;
  cartItemsData: CartItemData[] = [];
  orderData!: OrderData;

  constructor(
    private mpPreferenceService: MpPreferenceService,
    private cartService: CartService,
    private orderDataService: OrderDataService,
    private injector: Injector
  ) {
    this.platformId = this.injector.get(PLATFORM_ID);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.mpPreferenceService.preference$
        .pipe(filter((p): p is PreferenceDTO => !!p), take(1))
        .subscribe({
          next: async (preference: PreferenceDTO) => {
            this.preference = preference;
            try {
              await window.mpCheckout.initializeMercadoPago(preference.preferenceId, preference.publicKey);
              this.isLoading = false;
            } catch (err) {
              console.error('Error al cargar MercadoPago:', err);
            }
          },
          error: (err) => {
            console.error('Error obteniendo preferencia:', err);
          }
        });

      this.cartService.cartItemsData$.subscribe(data => {
        this.cartItemsData = data;
        this.updateTotal();
        if (!this.selectedPayment) {
          this.selectedPayment = this.isMercadoPagoDisabled ? 'transferencia' : 'mercadoPago' ;
        }
        this.orderDataService.orderData$.pipe(take(1)).subscribe(data => {
          this.orderData = data;
        });
      });

    } else {
      this.isLoading = false;
    }
  }

  updateTotal() {
    this.total = this.cartItemsData.reduce((sum, item) =>
      sum + (item.quantity.withDiscount ? item.quantity.finalPrice : item.quantity.basePrice), 0);
  }

  get isMercadoPagoDisabled(): boolean {
    return this.cartItemsData.some(item =>
      item.platform?.automaticPaymentAllowed === false ||
      item.quality?.automaticPayment === false
    );
  }

  onMpHover(event: MouseEvent): void {
    this.isHoveringMp = true;
    this.hoverX = event.clientX;
    this.hoverY = event.clientY;
  }

  onMpLeave(): void {
    this.isHoveringMp = false;
  }

}
