import { Component, Injector, OnInit, PLATFORM_ID } from "@angular/core";
import { MpPreferenceService } from "../../services/backend/mp/mp-preference.service";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: 'app-mercado-pago-button',
  templateUrl: './mp-checkout.component.html',
  styleUrls: ['./mp-checkout.component.css']
})
export class MercadoPagoButtonComponent implements OnInit {
  platformId: Object;

  constructor(
    private mpPreferenceService: MpPreferenceService,
    private injector: Injector
  ) {
    this.platformId = this.injector.get(PLATFORM_ID);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.mpPreferenceService.createPreference().subscribe((preferenceId: string) => {
        mpCheckout.initializeMercadoPago(preferenceId);
      });
    }
  }

}
