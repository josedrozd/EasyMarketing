import { Component, Injector, PLATFORM_ID } from '@angular/core';
import { MpPreferenceService, PreferenceDTO } from '../../../../services/backend/mp/mp-preference.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-payment-method',
  imports: [
    CommonModule
  ],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.css'
})
export class PaymentMethodComponent {

    platformId: Object;
    isLoading: boolean = true;
    preference!: PreferenceDTO;
  
    constructor(
      private mpPreferenceService: MpPreferenceService,
      private injector: Injector
    ) {
      this.platformId = this.injector.get(PLATFORM_ID);
    }
  
    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.mpPreferenceService.preference$
          .pipe(filter((preference): preference is PreferenceDTO => !!preference), take(1))
          .subscribe((preference: PreferenceDTO) => {
            this.preference = preference;
            mpCheckout.initializeMercadoPago(preference.preferenceId, preference.publicKey);
            this.isLoading = false;
          });
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      }
    }

}
