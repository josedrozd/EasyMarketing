import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OrderDataService } from '../../../../services/order-data.service';

@Component({
  selector: 'app-purchase-layout',
  imports: [
    RouterOutlet
  ],
  templateUrl: './purchase-layout.component.html',
  styleUrl: './purchase-layout.component.css'
})
export class PurchaseLayoutComponent {

  constructor(
    private router: Router,
    private orderDataService: OrderDataService
  ) {}

  goIndex() {
    this.orderDataService.reset();
    this.router.navigate(['/']);
  }

}
