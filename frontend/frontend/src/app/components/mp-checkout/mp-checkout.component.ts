import { Component, OnInit } from "@angular/core";
import { MpPreferenceService } from "../../services/backend/mp/mp-preference.service";

@Component({
  selector: 'app-mercado-pago-button',
  templateUrl: './mp-checkout.component.html',
  styleUrls: ['./mp-checkout.component.css']
})
export class MercadoPagoButtonComponent implements OnInit {
  constructor(
    private mpPreferenceService: MpPreferenceService
  ) {}

  ngOnInit(): void {
    this.mpPreferenceService.createPreference().subscribe((preferenceId: string) => {
      mpCheckout.initializeMercadoPago(preferenceId);
    });
  }

}
