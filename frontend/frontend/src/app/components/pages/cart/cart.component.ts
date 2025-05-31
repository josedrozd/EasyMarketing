import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [
    ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
  }

}
