import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-order-layout',
  imports: [
    RouterOutlet,
    MatIconModule
  ],
  templateUrl: './order-layout.component.html',
  styleUrl: './order-layout.component.css'
})
export class OrderLayoutComponent {

}
