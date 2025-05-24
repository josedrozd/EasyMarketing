import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { RouterModule } from '@angular/router';
import { ServicesComponent } from '../services/services.component';

@Component({
  selector: 'app-main',
  imports: [
    RouterModule,
    ServicesComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
